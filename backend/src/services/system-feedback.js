const { KnexService } = require('@feathersjs/knex')
const { BadRequest, NotFound } = require('@feathersjs/errors')

class SystemFeedbackService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    const isDeleted = query.is_deleted !== undefined ? query.is_deleted : false
    delete query.is_deleted

    let q = db('school.system_feedback').where({ is_deleted: isDeleted })

    if (query.rating) {
      q = q.where({ rating: parseInt(query.rating, 10) })
    }
    if (query.user_role) {
      q = q.where({ user_role: query.user_role })
    }
    if (query.module_tag) {
      q = q.where({ module_tag: query.module_tag })
    }

    q = q.orderBy('created_at', 'desc')

    const rows = await q

    // Calcular métricas agregadas globales para el panel directivo
    const allFeedbacks = await db('school.system_feedback')
      .where({ is_deleted: false })
      .select('rating', 'user_role', 'module_tag', 'sentiment')

    const totalReviews = allFeedbacks.length
    let sumRating = 0
    let positiveReviews = 0
    const starDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    const roleStats = {}
    const moduleStats = {}

    for (const fb of allFeedbacks) {
      const r = fb.rating || 0
      sumRating += r
      if (r >= 4) positiveReviews++
      if (starDistribution[r] !== undefined) {
        starDistribution[r]++
      }

      // Por rol
      const role = fb.user_role || 'other'
      if (!roleStats[role]) {
        roleStats[role] = { count: 0, sum: 0, positive: 0 }
      }
      roleStats[role].count++
      roleStats[role].sum += r
      if (r >= 4) roleStats[role].positive++

      // Por módulo
      const mod = fb.module_tag || 'general'
      if (!moduleStats[mod]) {
        moduleStats[mod] = { count: 0, sum: 0 }
      }
      moduleStats[mod].count++
      moduleStats[mod].sum += r
    }

    const averageRating = totalReviews > 0 ? +(sumRating / totalReviews).toFixed(2) : 5.0
    const satisfactionRate = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 100

    const roleBreakdown = {}
    for (const [rKey, rVal] of Object.entries(roleStats)) {
      roleBreakdown[rKey] = {
        count: rVal.count,
        avg_rating: +(rVal.sum / rVal.count).toFixed(2),
        satisfaction_rate: Math.round((rVal.positive / rVal.count) * 100)
      }
    }

    const moduleBreakdown = {}
    for (const [mKey, mVal] of Object.entries(moduleStats)) {
      moduleBreakdown[mKey] = {
        count: mVal.count,
        avg_rating: +(mVal.sum / mVal.count).toFixed(2)
      }
    }

    return {
      data: rows,
      total: rows.length,
      metrics: {
        total_reviews: totalReviews,
        average_rating: averageRating,
        satisfaction_rate: satisfactionRate,
        star_distribution: starDistribution,
        role_breakdown: roleBreakdown,
        module_breakdown: moduleBreakdown
      }
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const feedback = await db('school.system_feedback')
      .where({ id, is_deleted: false })
      .first()

    if (!feedback) {
      throw new NotFound(`Calificación con id ${id} no encontrada`)
    }

    return feedback
  }

  async create(data, params) {
    const db = this.getModel(params)
    const {
      rating,
      comment,
      module_tag = 'general',
      sentiment: customSentiment
    } = data

    const parsedRating = parseInt(rating, 10)
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      throw new BadRequest('La calificación debe ser un número entero entre 1 y 5 estrellas.')
    }

    let sentiment = customSentiment
    if (!sentiment) {
      if (parsedRating === 5) sentiment = 'excellent'
      else if (parsedRating === 4) sentiment = 'good'
      else if (parsedRating === 3) sentiment = 'neutral'
      else sentiment = 'poor'
    }

    const user = params?.user || {}
    const userName = data.user_name || (user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : null) || 'Usuario de la Plataforma'
    const userEmail = data.user_email || user.email || null
    const userRole = data.user_role || user.role || 'parent'
    const userId = user.id || data.user_id || null

    const [created] = await db('school.system_feedback').insert({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      user_role: userRole,
      rating: parsedRating,
      sentiment,
      module_tag: module_tag || 'general',
      comment: comment ? comment.trim() : null,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    }).returning('*')

    return created
  }

  async remove(id, params) {
    const db = this.getModel(params)
    await db('school.system_feedback').where({ id }).update({
      is_deleted: true,
      updated_at: db.fn.now()
    })
    return { id, success: true, message: 'Calificación eliminada lógicamente.' }
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.system_feedback',
    paginate: app.get('paginate')
  }

  app.use('system-feedback', new SystemFeedbackService(options, app))
}
