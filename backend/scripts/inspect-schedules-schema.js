const db = require('../src/database');

async function inspectTables() {
  try {
    const tables = ['subjects', 'subject_categories', 'class_subjects', 'schedules', 'timetable_slots', 'schedule_templates'];
    for (const t of tables) {
      const cols = await db('information_schema.columns')
        .where({ table_schema: 'school', table_name: t })
        .select('column_name', 'data_type', 'is_nullable');
      console.log(`\n=== Table school.${t} (${cols.length} cols) ===`);
      console.log(cols.map(c => `${c.column_name}: ${c.data_type} [${c.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}]`).join('\n'));
    }
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
inspectTables();
