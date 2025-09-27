-- ملف إنشاء الجداول الأولية لقاعدة بيانات Story Board Engine
-- تاريخ الإنشاء: 2024
-- الوصف: هذا الملف يحتوي على جميع الجداول المطلوبة لتطبيق إدارة القصص المصورة

-- إنشاء قاعدة البيانات (اختياري - قد تكون موجودة مسبقاً)
-- CREATE DATABASE IF NOT EXISTS storyboard_engine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE storyboard_engine;

-- ===================================
-- جدول المستخدمين (Users)
-- ===================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url VARCHAR(255),
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- جدول المشاريع (Projects)
-- ===================================
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(255),
    status ENUM('draft', 'in_progress', 'completed', 'archived') DEFAULT 'draft',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deadline DATE NULL,
    
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner_id (owner_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at),
    INDEX idx_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- جدول القصص المصورة (Storyboards)
-- ===================================
CREATE TABLE IF NOT EXISTS storyboards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scene_number INT DEFAULT 1,
    duration_seconds INT DEFAULT 30,
    aspect_ratio VARCHAR(20) DEFAULT '16:9',
    frame_rate INT DEFAULT 24,
    resolution VARCHAR(20) DEFAULT '1920x1080',
    status ENUM('draft', 'review', 'approved', 'rejected') DEFAULT 'draft',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_created_by (created_by),
    INDEX idx_status (status),
    INDEX idx_scene_number (scene_number),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- جدول الإطارات (Frames)
-- ===================================
CREATE TABLE IF NOT EXISTS frames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    storyboard_id INT NOT NULL,
    frame_number INT NOT NULL,
    title VARCHAR(200),
    description TEXT,
    image_url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    duration_seconds DECIMAL(5,2) DEFAULT 3.00,
    transition_type ENUM('cut', 'fade', 'dissolve', 'wipe', 'slide') DEFAULT 'cut',
    camera_angle VARCHAR(100),
    camera_movement VARCHAR(100),
    lighting_notes TEXT,
    audio_notes TEXT,
    dialogue TEXT,
    action_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (storyboard_id) REFERENCES storyboards(id) ON DELETE CASCADE,
    UNIQUE KEY unique_frame_per_storyboard (storyboard_id, frame_number),
    INDEX idx_storyboard_id (storyboard_id),
    INDEX idx_frame_number (frame_number),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- جدول التعليقات (Comments)
-- ===================================
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commentable_type ENUM('project', 'storyboard', 'frame') NOT NULL,
    commentable_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT NULL,
    content TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_commentable (commentable_type, commentable_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- جدول العلامات (Tags)
-- ===================================
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#3B82F6',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- جدول ربط العلامات بالمشاريع (Project Tags)
-- ===================================
CREATE TABLE IF NOT EXISTS project_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_tag (project_id, tag_id),
    INDEX idx_project_id (project_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- جدول أعضاء المشروع (Project Members)
-- ===================================
CREATE TABLE IF NOT EXISTS project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('owner', 'admin', 'editor', 'viewer') DEFAULT 'viewer',
    permissions JSON,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_member (project_id, user_id),
    INDEX idx_project_id (project_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- جدول الإشعارات (Notifications)
-- ===================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    related_type ENUM('project', 'storyboard', 'frame', 'comment') NULL,
    related_id INT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- جدول سجل الأنشطة (Activity Log)
-- ===================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- جدول الملفات المرفقة (Attachments)
-- ===================================
CREATE TABLE IF NOT EXISTS attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attachable_type ENUM('project', 'storyboard', 'frame') NOT NULL,
    attachable_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type ENUM('image', 'video', 'audio', 'document', 'other') NOT NULL,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_attachable (attachable_type, attachable_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_file_type (file_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- إدراج بيانات تجريبية (Sample Data)
-- ===================================

-- إدراج مستخدم افتراضي (admin)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@storyboard.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGOyQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', 'مدير النظام', 'admin'),
('editor', 'editor@storyboard.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGOyQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', 'محرر المحتوى', 'editor'),
('viewer', 'viewer@storyboard.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGOyQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', 'مشاهد', 'viewer');

-- إدراج علامات افتراضية
INSERT INTO tags (name, color, description) VALUES 
('إعلان تجاري', '#FF6B6B', 'إعلانات تجارية ومنتجات'),
('فيديو تعليمي', '#4ECDC4', 'محتوى تعليمي وشروحات'),
('فيلم قصير', '#45B7D1', 'أفلام قصيرة وسينمائية'),
('محتوى اجتماعي', '#96CEB4', 'محتوى لوسائل التواصل الاجتماعي'),
('عرض تقديمي', '#FFEAA7', 'عروض تقديمية ومؤسسية');

-- إدراج مشروع تجريبي
INSERT INTO projects (title, description, owner_id, status, priority) VALUES 
('مشروع تجريبي - إعلان منتج', 'مشروع تجريبي لإنشاء إعلان تجاري لمنتج جديد', 1, 'draft', 'medium');

-- إدراج قصة مصورة تجريبية
INSERT INTO storyboards (project_id, title, description, scene_number, created_by) VALUES 
(1, 'المشهد الافتتاحي', 'المشهد الافتتاحي للإعلان التجاري', 1, 1);

-- إدراج إطارات تجريبية
INSERT INTO frames (storyboard_id, frame_number, title, description, duration_seconds, camera_angle) VALUES 
(1, 1, 'لقطة افتتاحية', 'لقطة عامة للمنتج', 3.0, 'Wide Shot'),
(1, 2, 'لقطة مقربة', 'لقطة مقربة لتفاصيل المنتج', 2.5, 'Close-up'),
(1, 3, 'لقطة ختامية', 'عرض الشعار والمعلومات', 4.0, 'Medium Shot');

-- ===================================
-- إنشاء فهارس إضافية لتحسين الأداء
-- ===================================

-- فهارس مركبة لتحسين الاستعلامات الشائعة
CREATE INDEX idx_projects_owner_status ON projects(owner_id, status);
CREATE INDEX idx_storyboards_project_status ON storyboards(project_id, status);
CREATE INDEX idx_frames_storyboard_number ON frames(storyboard_id, frame_number);
CREATE INDEX idx_comments_type_id_user ON comments(commentable_type, commentable_id, user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ===================================
-- إنشاء Views مفيدة
-- ===================================

-- عرض إحصائيات المشاريع
CREATE VIEW project_stats AS
SELECT 
    p.id,
    p.title,
    p.status,
    p.owner_id,
    u.full_name as owner_name,
    COUNT(DISTINCT s.id) as storyboards_count,
    COUNT(DISTINCT f.id) as frames_count,
    COUNT(DISTINCT c.id) as comments_count,
    p.created_at,
    p.updated_at
FROM projects p
LEFT JOIN users u ON p.owner_id = u.id
LEFT JOIN storyboards s ON p.id = s.project_id
LEFT JOIN frames f ON s.id = f.storyboard_id
LEFT JOIN comments c ON (c.commentable_type = 'project' AND c.commentable_id = p.id)
GROUP BY p.id, p.title, p.status, p.owner_id, u.full_name, p.created_at, p.updated_at;

-- عرض تفاصيل القصص المصورة
CREATE VIEW storyboard_details AS
SELECT 
    s.id,
    s.title,
    s.description,
    s.scene_number,
    s.status,
    p.title as project_title,
    u.full_name as creator_name,
    COUNT(f.id) as frames_count,
    SUM(f.duration_seconds) as total_duration,
    s.created_at,
    s.updated_at
FROM storyboards s
JOIN projects p ON s.project_id = p.id
JOIN users u ON s.created_by = u.id
LEFT JOIN frames f ON s.id = f.storyboard_id
GROUP BY s.id, s.title, s.description, s.scene_number, s.status, p.title, u.full_name, s.created_at, s.updated_at;

-- ===================================
-- إجراءات مخزنة مفيدة (Stored Procedures)
-- ===================================

DELIMITER //

-- إجراء لإنشاء مشروع جديد مع قصة مصورة افتراضية
CREATE PROCEDURE CreateProjectWithStoryboard(
    IN p_title VARCHAR(200),
    IN p_description TEXT,
    IN p_owner_id INT,
    IN s_title VARCHAR(200),
    IN s_description TEXT
)
BEGIN
    DECLARE project_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO projects (title, description, owner_id) 
    VALUES (p_title, p_description, p_owner_id);
    
    SET project_id = LAST_INSERT_ID();
    
    INSERT INTO storyboards (project_id, title, description, created_by)
    VALUES (project_id, s_title, s_description, p_owner_id);
    
    COMMIT;
    
    SELECT project_id as new_project_id;
END //

-- إجراء لحذف مشروع وجميع بياناته المرتبطة
CREATE PROCEDURE DeleteProjectCompletely(IN p_project_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- حذف جميع البيانات المرتبطة بالمشروع
    DELETE FROM comments WHERE commentable_type = 'project' AND commentable_id = p_project_id;
    DELETE FROM project_tags WHERE project_id = p_project_id;
    DELETE FROM project_members WHERE project_id = p_project_id;
    DELETE FROM attachments WHERE attachable_type = 'project' AND attachable_id = p_project_id;
    
    -- حذف المشروع (سيحذف القصص المصورة والإطارات تلقائياً بسبب CASCADE)
    DELETE FROM projects WHERE id = p_project_id;
    
    COMMIT;
END //

DELIMITER ;

-- ===================================
-- تعليقات ختامية
-- ===================================

-- تم إنشاء جميع الجداول والفهارس والإجراءات المطلوبة بنجاح
-- يمكن الآن استخدام قاعدة البيانات مع تطبيق Story Board Engine

-- للتحقق من إنشاء الجداول:
-- SHOW TABLES;

-- للتحقق من بنية جدول معين:
-- DESCRIBE table_name;

-- لعرض إحصائيات سريعة:
-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_projects FROM projects;
-- SELECT COUNT(*) as total_storyboards FROM storyboards;
-- SELECT COUNT(*) as total_frames FROM frames;