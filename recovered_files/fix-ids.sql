SELECT setval(pg_get_serial_sequence('projects', 'id'), COALESCE((SELECT MAX(id) FROM projects), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('skills', 'id'), COALESCE((SELECT MAX(id) FROM skills), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('experience', 'id'), COALESCE((SELECT MAX(id) FROM experience), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('home_content', 'id'), COALESCE((SELECT MAX(id) FROM home_content), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('faqs', 'id'), COALESCE((SELECT MAX(id) FROM faqs), 0) + 1, false);