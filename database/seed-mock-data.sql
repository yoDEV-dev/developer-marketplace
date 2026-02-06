-- ============================================================
-- yoDEV Marketplace — Mock Developer Data for Testing
-- ============================================================

-- 6 developer profiles with skills, languages, portfolio, and reviews

-- Developer 1: Mateo Silva (Brazil) — Full-Stack
INSERT INTO developer_profiles (
  id, user_id, display_name, headline, bio, profile_photo_url,
  country_code, city, timezone, years_experience,
  availability_status, pricing_currency, hourly_rate_min, hourly_rate_max,
  free_consultation, open_to_negotiation,
  work_arrangement, preferred_duration, contract_openness,
  avg_rating, total_reviews, avg_response_hours, profile_completion_pct,
  is_verified, is_published
) VALUES (
  'a0000001-0000-0000-0000-000000000001',
  'b0000001-0000-0000-0000-000000000001',
  'Mateo Silva', 'Senior Full-Stack Engineer',
  'Passionate full-stack engineer with 8+ years of experience building scalable web and mobile applications. I specialize in React, Node.js, and cloud infrastructure. My approach combines clean code practices with pragmatic problem-solving.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'BR', 'Sao Paulo', 'America/Sao_Paulo', '5-10',
  'available', 'USD', 45, 70,
  TRUE, TRUE,
  '{remote,hybrid}', '{medium,long}', '{freelance,contract_to_hire}',
  5.0, 3, 1.5, 95,
  TRUE, TRUE
);

-- Developer 2: Valentina Torres (Colombia) — UI/UX Designer
INSERT INTO developer_profiles (
  id, user_id, display_name, headline, bio, profile_photo_url,
  country_code, city, timezone, years_experience,
  availability_status, pricing_currency, hourly_rate_min, hourly_rate_max,
  free_consultation, open_to_negotiation,
  work_arrangement, preferred_duration, contract_openness,
  avg_rating, total_reviews, avg_response_hours, profile_completion_pct,
  is_verified, is_published
) VALUES (
  'a0000002-0000-0000-0000-000000000002',
  'b0000002-0000-0000-0000-000000000002',
  'Valentina Torres', 'UI/UX Designer & Frontend Developer',
  'Design-driven frontend developer specializing in creating beautiful, accessible user experiences. Proficient in Figma, React, and design systems. I bridge the gap between design and development.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'CO', 'Medellin', 'America/Bogota', '3-5',
  'available', 'USD', 35, 55,
  TRUE, TRUE,
  '{remote}', '{short,medium}', '{freelance}',
  4.8, 2, 2.0, 90,
  TRUE, TRUE
);

-- Developer 3: Santiago Ramirez (Chile) — Backend & DevOps
INSERT INTO developer_profiles (
  id, user_id, display_name, headline, bio, profile_photo_url,
  country_code, city, timezone, years_experience,
  availability_status, pricing_currency, hourly_rate_min, hourly_rate_max,
  free_consultation, open_to_negotiation,
  work_arrangement, preferred_duration, contract_openness,
  avg_rating, total_reviews, avg_response_hours, profile_completion_pct,
  is_verified, is_published
) VALUES (
  'a0000003-0000-0000-0000-000000000003',
  'b0000003-0000-0000-0000-000000000003',
  'Santiago Ramirez', 'Backend Engineer & DevOps Specialist',
  'Infrastructure and backend specialist with deep expertise in AWS, Kubernetes, and distributed systems. I help teams build reliable, scalable platforms that handle millions of requests.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  'CL', 'Santiago', 'America/Santiago', '10-15',
  'limited', 'USD', 60, 90,
  FALSE, TRUE,
  '{remote,onsite}', '{long,any}', '{freelance,contract_to_hire,fulltime}',
  4.9, 2, 3.0, 88,
  TRUE, TRUE
);

-- Developer 4: Camila Herrera (Mexico) — Mobile Developer
INSERT INTO developer_profiles (
  id, user_id, display_name, headline, bio, profile_photo_url,
  country_code, city, timezone, years_experience,
  availability_status, pricing_currency, hourly_rate_min, hourly_rate_max,
  free_consultation, open_to_negotiation,
  work_arrangement, preferred_duration, contract_openness,
  avg_rating, total_reviews, avg_response_hours, profile_completion_pct,
  is_verified, is_published
) VALUES (
  'a0000004-0000-0000-0000-000000000004',
  'b0000004-0000-0000-0000-000000000004',
  'Camila Herrera', 'Mobile App Developer (iOS & Android)',
  'Cross-platform mobile developer with a passion for creating polished, performant apps. Expert in React Native and Flutter. I have shipped 15+ apps to the App Store and Play Store.',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'MX', 'Mexico City', 'America/Mexico_City', '5-10',
  'available', 'USD', 40, 65,
  TRUE, FALSE,
  '{remote}', '{medium,long}', '{freelance,contract_to_hire}',
  4.7, 2, 1.0, 85,
  TRUE, TRUE
);

-- Developer 5: Lucas Mendoza (Argentina) — Data Engineer
INSERT INTO developer_profiles (
  id, user_id, display_name, headline, bio, profile_photo_url,
  country_code, city, timezone, years_experience,
  availability_status, pricing_currency, hourly_rate_min, hourly_rate_max,
  free_consultation, open_to_negotiation,
  work_arrangement, preferred_duration, contract_openness,
  avg_rating, total_reviews, avg_response_hours, profile_completion_pct,
  is_verified, is_published
) VALUES (
  'a0000005-0000-0000-0000-000000000005',
  'b0000005-0000-0000-0000-000000000005',
  'Lucas Mendoza', 'Data Engineer & ML Specialist',
  'Data engineer focused on building robust data pipelines and ML infrastructure. Experienced with Python, Spark, and cloud data platforms. I help companies turn raw data into actionable insights.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  'AR', 'Buenos Aires', 'America/Argentina/Buenos_Aires', '5-10',
  'available', 'USD', 50, 80,
  FALSE, TRUE,
  '{remote,hybrid}', '{medium,long}', '{freelance,contract_to_hire}',
  4.6, 0, 4.0, 80,
  FALSE, TRUE
);

-- Developer 6: Isabella Vargas (Peru) — WordPress & E-commerce
INSERT INTO developer_profiles (
  id, user_id, display_name, headline, bio, profile_photo_url,
  country_code, city, timezone, years_experience,
  availability_status, pricing_currency, hourly_rate_min, hourly_rate_max,
  free_consultation, open_to_negotiation,
  work_arrangement, preferred_duration, contract_openness,
  avg_rating, total_reviews, avg_response_hours, profile_completion_pct,
  is_verified, is_published
) VALUES (
  'a0000006-0000-0000-0000-000000000006',
  'b0000006-0000-0000-0000-000000000006',
  'Isabella Vargas', 'E-commerce & WordPress Specialist',
  'E-commerce expert specializing in WooCommerce, Shopify, and custom solutions. I help small and medium businesses launch and optimize their online stores with a focus on conversion.',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  'PE', 'Lima', 'America/Lima', '3-5',
  'booked', 'USD', 25, 40,
  TRUE, TRUE,
  '{remote}', '{short,medium}', '{freelance}',
  4.5, 0, 2.5, 75,
  FALSE, TRUE
);


-- ============================================================
-- SKILLS (link developers to tech_tags)
-- ============================================================

DO $$
DECLARE
  t_react UUID;
  t_nodejs UUID;
  t_typescript UUID;
  t_postgresql UUID;
  t_aws UUID;
  t_docker UUID;
  t_python UUID;
  t_nextjs UUID;
  t_tailwind UUID;
  t_figma UUID;
  t_vue UUID;
  t_kubernetes UUID;
  t_react_native UUID;
  t_flutter UUID;
  t_swift UUID;
  t_firebase UUID;
  t_terraform UUID;
  t_go UUID;
  t_mongodb UUID;
  t_wordpress UUID;
  t_shopify UUID;
  t_php UUID;
  t_mysql UUID;
  t_spark UUID;
BEGIN
  SELECT id INTO t_react FROM tech_tags WHERE name = 'React';
  SELECT id INTO t_nodejs FROM tech_tags WHERE name = 'Node.js';
  SELECT id INTO t_typescript FROM tech_tags WHERE name = 'TypeScript';
  SELECT id INTO t_postgresql FROM tech_tags WHERE name = 'PostgreSQL';
  SELECT id INTO t_aws FROM tech_tags WHERE name = 'AWS';
  SELECT id INTO t_docker FROM tech_tags WHERE name = 'Docker';
  SELECT id INTO t_python FROM tech_tags WHERE name = 'Python';
  SELECT id INTO t_nextjs FROM tech_tags WHERE name = 'Next.js';
  SELECT id INTO t_tailwind FROM tech_tags WHERE name = 'Tailwind CSS';
  SELECT id INTO t_figma FROM tech_tags WHERE name = 'Figma';
  SELECT id INTO t_vue FROM tech_tags WHERE name = 'Vue.js';
  SELECT id INTO t_kubernetes FROM tech_tags WHERE name = 'Kubernetes';
  SELECT id INTO t_react_native FROM tech_tags WHERE name = 'React Native';
  SELECT id INTO t_flutter FROM tech_tags WHERE name = 'Flutter';
  SELECT id INTO t_swift FROM tech_tags WHERE name = 'Swift';
  SELECT id INTO t_firebase FROM tech_tags WHERE name = 'Firebase';
  SELECT id INTO t_terraform FROM tech_tags WHERE name = 'Terraform';
  SELECT id INTO t_go FROM tech_tags WHERE name = 'Go';
  SELECT id INTO t_mongodb FROM tech_tags WHERE name = 'MongoDB';
  SELECT id INTO t_wordpress FROM tech_tags WHERE name = 'WordPress';
  SELECT id INTO t_shopify FROM tech_tags WHERE name = 'Shopify';
  SELECT id INTO t_php FROM tech_tags WHERE name = 'PHP';
  SELECT id INTO t_mysql FROM tech_tags WHERE name = 'MySQL';
  SELECT id INTO t_spark FROM tech_tags WHERE name = 'Apache Spark';

  -- Mateo: React, Node.js, TypeScript, PostgreSQL, AWS, Docker
  INSERT INTO developer_skills (developer_id, tech_tag_id, skill_level, display_order) VALUES
    ('a0000001-0000-0000-0000-000000000001', t_react, 'primary', 1),
    ('a0000001-0000-0000-0000-000000000001', t_nodejs, 'primary', 2),
    ('a0000001-0000-0000-0000-000000000001', t_typescript, 'primary', 3),
    ('a0000001-0000-0000-0000-000000000001', t_postgresql, 'primary', 4),
    ('a0000001-0000-0000-0000-000000000001', t_aws, 'secondary', 5),
    ('a0000001-0000-0000-0000-000000000001', t_docker, 'secondary', 6);

  -- Valentina: Figma, React, Next.js, Tailwind, TypeScript, Vue
  INSERT INTO developer_skills (developer_id, tech_tag_id, skill_level, display_order) VALUES
    ('a0000002-0000-0000-0000-000000000002', t_figma, 'primary', 1),
    ('a0000002-0000-0000-0000-000000000002', t_react, 'primary', 2),
    ('a0000002-0000-0000-0000-000000000002', t_nextjs, 'primary', 3),
    ('a0000002-0000-0000-0000-000000000002', t_tailwind, 'primary', 4),
    ('a0000002-0000-0000-0000-000000000002', t_typescript, 'secondary', 5),
    ('a0000002-0000-0000-0000-000000000002', t_vue, 'secondary', 6);

  -- Santiago: AWS, Kubernetes, Docker, Terraform, Go, PostgreSQL
  INSERT INTO developer_skills (developer_id, tech_tag_id, skill_level, display_order) VALUES
    ('a0000003-0000-0000-0000-000000000003', t_aws, 'primary', 1),
    ('a0000003-0000-0000-0000-000000000003', t_kubernetes, 'primary', 2),
    ('a0000003-0000-0000-0000-000000000003', t_docker, 'primary', 3),
    ('a0000003-0000-0000-0000-000000000003', t_terraform, 'primary', 4),
    ('a0000003-0000-0000-0000-000000000003', t_go, 'secondary', 5),
    ('a0000003-0000-0000-0000-000000000003', t_postgresql, 'secondary', 6);

  -- Camila: React Native, Flutter, Swift, Firebase, TypeScript, React
  INSERT INTO developer_skills (developer_id, tech_tag_id, skill_level, display_order) VALUES
    ('a0000004-0000-0000-0000-000000000004', t_react_native, 'primary', 1),
    ('a0000004-0000-0000-0000-000000000004', t_flutter, 'primary', 2),
    ('a0000004-0000-0000-0000-000000000004', t_swift, 'primary', 3),
    ('a0000004-0000-0000-0000-000000000004', t_firebase, 'primary', 4),
    ('a0000004-0000-0000-0000-000000000004', t_typescript, 'secondary', 5),
    ('a0000004-0000-0000-0000-000000000004', t_react, 'secondary', 6);

  -- Lucas: Python, AWS, PostgreSQL, MongoDB, Docker (+ Spark if exists)
  INSERT INTO developer_skills (developer_id, tech_tag_id, skill_level, display_order) VALUES
    ('a0000005-0000-0000-0000-000000000005', t_python, 'primary', 1),
    ('a0000005-0000-0000-0000-000000000005', t_aws, 'primary', 2),
    ('a0000005-0000-0000-0000-000000000005', t_postgresql, 'primary', 3),
    ('a0000005-0000-0000-0000-000000000005', t_mongodb, 'secondary', 4),
    ('a0000005-0000-0000-0000-000000000005', t_docker, 'secondary', 5);

  IF t_spark IS NOT NULL THEN
    INSERT INTO developer_skills (developer_id, tech_tag_id, skill_level, display_order) VALUES
      ('a0000005-0000-0000-0000-000000000005', t_spark, 'primary', 6);
  END IF;

  -- Isabella: WordPress, Shopify, PHP, MySQL, Figma, Tailwind
  INSERT INTO developer_skills (developer_id, tech_tag_id, skill_level, display_order) VALUES
    ('a0000006-0000-0000-0000-000000000006', t_wordpress, 'primary', 1),
    ('a0000006-0000-0000-0000-000000000006', t_shopify, 'primary', 2),
    ('a0000006-0000-0000-0000-000000000006', t_php, 'primary', 3),
    ('a0000006-0000-0000-0000-000000000006', t_mysql, 'primary', 4),
    ('a0000006-0000-0000-0000-000000000006', t_figma, 'secondary', 5),
    ('a0000006-0000-0000-0000-000000000006', t_tailwind, 'secondary', 6);
END $$;


-- ============================================================
-- LANGUAGES
-- ============================================================

INSERT INTO developer_languages (developer_id, language, proficiency) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Portuguese', 'native'),
  ('a0000001-0000-0000-0000-000000000001', 'English', 'fluent'),
  ('a0000001-0000-0000-0000-000000000001', 'Spanish', 'conversational'),
  ('a0000002-0000-0000-0000-000000000002', 'Spanish', 'native'),
  ('a0000002-0000-0000-0000-000000000002', 'English', 'fluent'),
  ('a0000003-0000-0000-0000-000000000003', 'Spanish', 'native'),
  ('a0000003-0000-0000-0000-000000000003', 'English', 'fluent'),
  ('a0000003-0000-0000-0000-000000000003', 'German', 'basic'),
  ('a0000004-0000-0000-0000-000000000004', 'Spanish', 'native'),
  ('a0000004-0000-0000-0000-000000000004', 'English', 'fluent'),
  ('a0000004-0000-0000-0000-000000000004', 'French', 'conversational'),
  ('a0000005-0000-0000-0000-000000000005', 'Spanish', 'native'),
  ('a0000005-0000-0000-0000-000000000005', 'English', 'fluent'),
  ('a0000006-0000-0000-0000-000000000006', 'Spanish', 'native'),
  ('a0000006-0000-0000-0000-000000000006', 'English', 'conversational');


-- ============================================================
-- PORTFOLIO PROJECTS
-- ============================================================

-- Mateo's portfolio
INSERT INTO portfolio_projects (developer_id, title, description, completion_year, is_featured, display_order) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'FinTech Mobile App', 'Digital banking app with real-time transactions, biometric auth, and investment tracking. Built for a Brazilian neobank serving 200K+ users.', 2025, TRUE, 1),
  ('a0000001-0000-0000-0000-000000000001', 'E-commerce Platform', 'Scalable marketplace handling 50K+ daily orders with real-time inventory management and multi-vendor support.', 2024, TRUE, 2),
  ('a0000001-0000-0000-0000-000000000001', 'Healthcare Dashboard', 'Patient management system with appointment scheduling and telemedicine integration for a network of 30 clinics.', 2024, FALSE, 3);

-- Valentina's portfolio
INSERT INTO portfolio_projects (developer_id, title, description, completion_year, is_featured, display_order) VALUES
  ('a0000002-0000-0000-0000-000000000002', 'SaaS Design System', 'Complete design system with 80+ components, dark mode support, and accessibility compliance for a project management tool.', 2025, TRUE, 1),
  ('a0000002-0000-0000-0000-000000000002', 'Travel Booking Redesign', 'Full UX redesign of a travel platform resulting in 40% increase in booking completion rate.', 2024, TRUE, 2);

-- Santiago's portfolio
INSERT INTO portfolio_projects (developer_id, title, description, completion_year, is_featured, display_order) VALUES
  ('a0000003-0000-0000-0000-000000000003', 'Cloud Migration', 'Migrated monolithic application to microservices on AWS EKS, reducing infrastructure costs by 60% and improving uptime to 99.99%.', 2025, TRUE, 1),
  ('a0000003-0000-0000-0000-000000000003', 'CI/CD Pipeline', 'Built automated deployment pipeline with GitHub Actions, Terraform, and ArgoCD for a team of 40 developers.', 2024, TRUE, 2);

-- Camila's portfolio
INSERT INTO portfolio_projects (developer_id, title, description, completion_year, is_featured, display_order) VALUES
  ('a0000004-0000-0000-0000-000000000004', 'Fitness Tracking App', 'Cross-platform fitness app with workout tracking, social features, and Apple Health integration. 100K+ downloads.', 2025, TRUE, 1),
  ('a0000004-0000-0000-0000-000000000004', 'Food Delivery App', 'Real-time delivery tracking with live driver GPS, push notifications, and in-app payments.', 2024, TRUE, 2);


-- ============================================================
-- REVIEWS (developer_reviews table)
-- ============================================================

-- Reviews for Mateo
INSERT INTO developer_reviews (developer_id, reviewer_id, reviewer_name, rating_overall, rating_communication, rating_quality, rating_timeliness, rating_value, review_text, is_verified, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'b0000002-0000-0000-0000-000000000002', 'Sarah Chen', 5, 5, 5, 5, 5, 'Mateo delivered exceptional work on our mobile app. His attention to detail and proactive communication made the entire process smooth. Highly recommend!', TRUE, NOW() - INTERVAL '30 days'),
  ('a0000001-0000-0000-0000-000000000001', 'b0000003-0000-0000-0000-000000000003', 'Michael Torres', 5, 5, 5, 4, 5, 'Outstanding technical skills and great problem-solving ability. Mateo helped us refactor our entire backend and improved performance by 3x.', TRUE, NOW() - INTERVAL '60 days'),
  ('a0000001-0000-0000-0000-000000000001', 'b0000004-0000-0000-0000-000000000004', 'Emily Rodriguez', 5, 5, 5, 5, 5, 'Professional, reliable, and incredibly skilled. Mateo transformed our outdated platform into a modern, scalable solution.', TRUE, NOW() - INTERVAL '90 days');

-- Reviews for Valentina
INSERT INTO developer_reviews (developer_id, reviewer_id, reviewer_name, rating_overall, rating_communication, rating_quality, rating_timeliness, rating_value, review_text, is_verified, created_at) VALUES
  ('a0000002-0000-0000-0000-000000000002', 'b0000005-0000-0000-0000-000000000005', 'David Kim', 5, 5, 5, 5, 4, 'Valentina has an incredible eye for design. She created a beautiful, intuitive interface that our users absolutely love.', TRUE, NOW() - INTERVAL '20 days'),
  ('a0000002-0000-0000-0000-000000000002', 'b0000006-0000-0000-0000-000000000006', 'Anna Weber', 5, 5, 5, 5, 5, 'The design system Valentina built has been transformative for our product development speed. Worth every penny.', TRUE, NOW() - INTERVAL '45 days');

-- Reviews for Santiago
INSERT INTO developer_reviews (developer_id, reviewer_id, reviewer_name, rating_overall, rating_communication, rating_quality, rating_timeliness, rating_value, review_text, is_verified, created_at) VALUES
  ('a0000003-0000-0000-0000-000000000003', 'b0000005-0000-0000-0000-000000000005', 'James Park', 5, 4, 5, 5, 5, 'Santiago is a DevOps wizard. He reduced our AWS bill by 60% while actually improving performance. Cannot recommend enough.', TRUE, NOW() - INTERVAL '15 days'),
  ('a0000003-0000-0000-0000-000000000003', 'b0000006-0000-0000-0000-000000000006', 'Lisa Chang', 5, 5, 5, 4, 5, 'Rock-solid infrastructure work. Santiago set up our entire CI/CD pipeline and it has been flawless for 8 months.', TRUE, NOW() - INTERVAL '50 days');

-- Reviews for Camila
INSERT INTO developer_reviews (developer_id, reviewer_id, reviewer_name, rating_overall, rating_communication, rating_quality, rating_timeliness, rating_value, review_text, is_verified, created_at) VALUES
  ('a0000004-0000-0000-0000-000000000004', 'b0000005-0000-0000-0000-000000000005', 'Tom Wilson', 5, 5, 5, 4, 5, 'Camila built us a beautiful, performant mobile app. She has a deep understanding of both iOS and Android platforms.', TRUE, NOW() - INTERVAL '25 days'),
  ('a0000004-0000-0000-0000-000000000004', 'b0000006-0000-0000-0000-000000000006', 'Maria Santos', 4, 5, 4, 4, 4, 'Great work on our fitness app. Camila was communicative throughout and delivered a polished product.', TRUE, NOW() - INTERVAL '55 days');


-- ============================================================
-- PRICING MODELS
-- ============================================================

INSERT INTO developer_pricing_models (developer_id, model_type) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'hourly'),
  ('a0000001-0000-0000-0000-000000000001', 'project_based'),
  ('a0000001-0000-0000-0000-000000000001', 'monthly_retainer'),
  ('a0000002-0000-0000-0000-000000000002', 'hourly'),
  ('a0000002-0000-0000-0000-000000000002', 'project_based'),
  ('a0000003-0000-0000-0000-000000000003', 'hourly'),
  ('a0000003-0000-0000-0000-000000000003', 'monthly_retainer'),
  ('a0000004-0000-0000-0000-000000000004', 'hourly'),
  ('a0000004-0000-0000-0000-000000000004', 'project_based'),
  ('a0000005-0000-0000-0000-000000000005', 'hourly'),
  ('a0000005-0000-0000-0000-000000000005', 'project_based'),
  ('a0000006-0000-0000-0000-000000000006', 'project_based'),
  ('a0000006-0000-0000-0000-000000000006', 'hourly');


-- ============================================================
-- PAYMENT METHODS
-- ============================================================

INSERT INTO developer_payment_methods (developer_id, method) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'bank_transfer'),
  ('a0000001-0000-0000-0000-000000000001', 'wise'),
  ('a0000001-0000-0000-0000-000000000001', 'paypal'),
  ('a0000002-0000-0000-0000-000000000002', 'paypal'),
  ('a0000002-0000-0000-0000-000000000002', 'wise'),
  ('a0000003-0000-0000-0000-000000000003', 'bank_transfer'),
  ('a0000003-0000-0000-0000-000000000003', 'wise'),
  ('a0000004-0000-0000-0000-000000000004', 'paypal'),
  ('a0000004-0000-0000-0000-000000000004', 'payoneer'),
  ('a0000005-0000-0000-0000-000000000005', 'bank_transfer'),
  ('a0000005-0000-0000-0000-000000000005', 'crypto'),
  ('a0000006-0000-0000-0000-000000000006', 'paypal'),
  ('a0000006-0000-0000-0000-000000000006', 'bank_transfer');
