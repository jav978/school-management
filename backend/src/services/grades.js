const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class GradesService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.exam_results as er')
      .join('school.exams as e', 'er.exam_id', 'e.id')
      .join('school.students as s', 'er.student_id', 's.id')
      .leftJoin('school.class_subjects as cs', 'e.class_subject_id', 'cs.id')
      .leftJoin('school.classes as cl', 'cs.class_id', 'cl.id')
      .leftJoin('school.subjects as sub', 'cs.subject_id', 'sub.id')
      .leftJoin('school.teachers as t', 'cs.teacher_id', 't.id')
      .leftJoin('school.terms as term', 'e.term_id', 'term.id')
      .where('er.is_deleted', false)
      .select(
        'er.id',
        'er.uuid',
        'er.exam_id',
        'er.student_id',
        'er.marks_obtained',
        'er.total_marks',
        'er.percentage',
        'er.grade_letter',
        'er.is_passed',
        'er.is_absent',
        'er.remarks',
        'er.graded_at',
        's.student_id as student_code',
        's.first_name as student_first_name',
        's.last_name as student_last_name',
        'cl.id as class_id',
        'cl.name as class_name',
        'cl.section as class_section',
        'sub.name as subject_name',
        'sub.code as subject_code',
        'sub.color_hex as subject_color',
        'e.title as exam_title',
        'e.exam_type',
        'e.exam_date',
        'e.passing_marks',
        'term.id as term_id',
        'term.name as term_name',
        't.first_name as teacher_first_name',
        't.last_name as teacher_last_name'
      )

    if (query.class_id) {
      knexQuery = knexQuery.where('cs.class_id', query.class_id)
    }
    if (query.exam_id) {
      knexQuery = knexQuery.where('er.exam_id', query.exam_id)
    }
    if (query.term_id) {
      knexQuery = knexQuery.where('e.term_id', query.term_id)
    }
    if (query.exam_type) {
      knexQuery = knexQuery.where('e.exam_type', query.exam_type)
    }
    if (query.student_id) {
      knexQuery = knexQuery.where('er.student_id', query.student_id)
    }

    const data = await knexQuery.orderBy([
      { column: 'e.exam_date', order: 'desc' },
      { column: 's.last_name', order: 'asc' }
    ])

    return {
      total: data.length,
      limit: 100,
      skip: 0,
      data
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const record = await db('school.exam_results as er')
      .join('school.exams as e', 'er.exam_id', 'e.id')
      .join('school.students as s', 'er.student_id', 's.id')
      .leftJoin('school.class_subjects as cs', 'e.class_subject_id', 'cs.id')
      .leftJoin('school.classes as cl', 'cs.class_id', 'cl.id')
      .leftJoin('school.subjects as sub', 'cs.subject_id', 'sub.id')
      .where('er.id', id)
      .select('er.*', 's.first_name as student_first_name', 's.last_name as student_last_name', 'e.title as exam_title')
      .first()

    if (!record) {
      throw new BadRequest(`Calificación no encontrada con id ${id}`)
    }
    return record
  }

  async create(data, params) {
    if (!data.exam_id) throw new BadRequest('exam_id es requerido')
    if (!data.student_id) throw new BadRequest('student_id es requerido')
    if (data.marks_obtained === undefined) throw new BadRequest('marks_obtained es requerido')

    const db = this.getModel(params)
    const marks = Number(data.marks_obtained)
    const total = Number(data.total_marks || 20)

    let gradeLetter = data.grade_letter
    if (!gradeLetter) {
      const pct = (marks / total) * 100
      gradeLetter = pct >= 90 ? 'A' : (pct >= 70 ? 'B' : (pct >= 50 ? 'C' : 'D'))
    }

    const isPassed = data.is_passed !== undefined ? Boolean(data.is_passed) : (marks >= (total * 0.5))

    const payload = {
      uuid: crypto.randomUUID(),
      exam_id: data.exam_id,
      student_id: data.student_id,
      marks_obtained: marks,
      total_marks: total,
      grade_letter: gradeLetter,
      is_passed: isPassed,
      attempt_number: data.attempt_number || 1,
      is_absent: Boolean(data.is_absent),
      remarks: data.remarks || null,
      graded_by: data.graded_by || 1,
      graded_at: new Date(),
      created_at: new Date(),
      is_deleted: false,
      version: 1
    }

    const [inserted] = await db('school.exam_results').insert(payload).returning('*')
    return inserted
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const patchData = { ...data, updated_at: new Date() }
    
    // Never send percentage to Postgres (it's a generated column)
    delete patchData.percentage

    if (patchData.marks_obtained !== undefined) {
      const marks = Number(patchData.marks_obtained)
      const total = Number(patchData.total_marks || 20)
      if (!patchData.grade_letter) {
        const pct = (marks / total) * 100
        patchData.grade_letter = pct >= 90 ? 'A' : (pct >= 70 ? 'B' : (pct >= 50 ? 'C' : 'D'))
      }
      if (patchData.is_passed === undefined) {
        patchData.is_passed = marks >= (total * 0.5)
      }
    }

    const [updated] = await db('school.exam_results').where({ id }).update(patchData).returning('*')
    return updated
  }

  async remove(id, params) {
    const db = this.getModel(params)
    const [removed] = await db('school.exam_results').where({ id }).update({ is_deleted: true, deleted_at: new Date() }).returning('*')
    return removed
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.exam_results',
    paginate: {
      default: 50,
      max: 100
    }
  }

  app.use('grades', new GradesService(options))

  const service = app.service('grades')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      create: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      update: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      patch: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      remove: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')]
    }
  })
}
