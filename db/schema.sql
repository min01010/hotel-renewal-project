-- 사용자 테이블 생성
-- CREATE TABLE users (
--   user_unique_id int(11) NOT NULL AUTO_INCREMENT,
--   user_id varchar(50) NOT NULL,
--   user_name varchar(50) NOT NULL,
--   password varchar(255) NOT NULL,
--   email varchar(100) NOT NULL,
--   phone_number varchar(15) DEFAULT NULL,
--   is_verified tinyint(1) DEFAULT 0,
--   naver_id varchar(100) DEFAULT NULL,
--   kakao_id varchar(100) DEFAULT NULL,
--   created_at datetime DEFAULT current_timestamp(),
--   updated_at datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
--   PRIMARY KEY (user_unique_id),
--   UNIQUE KEY user_id (user_id),
--   UNIQUE KEY user_name (user_name),
--   UNIQUE KEY email (email)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1. 사용자 테이블
CREATE TABLE users (
    user_unique_id INT AUTO_INCREMENT PRIMARY KEY,    -- 사용자 고유 ID (자동 증가)
    email VARCHAR(255) UNIQUE NOT NULL,                -- 사용자 이메일 (고유)
    name VARCHAR(255),                                 -- 사용자 이름
    phone_number VARCHAR(20) UNIQUE NOT NULL,          -- 사용자 핸드폰 번호 (NULL 불가)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- 생성일시
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- 수정일시
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블에 주석 추가
ALTER TABLE users COMMENT = '사용자 테이블 (기본 사용자 정보 관리)';

-- 각 컬럼에 대한 주석 추가
ALTER TABLE users
    MODIFY user_unique_id INT AUTO_INCREMENT COMMENT '사용자 고유 ID (자동 증가)',
    MODIFY email VARCHAR(255) UNIQUE NOT NULL COMMENT '사용자 이메일 (고유)',
    MODIFY name VARCHAR(255) COMMENT '사용자 이름',
    MODIFY phone_number VARCHAR(20) UNIQUE NOT NULL COMMENT '사용자 핸드폰 번호 (고유)',
    MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '사용자 계정 생성일시',
    MODIFY updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '사용자 계정 수정일시';


-- 2. 네이버 로그인 정보 테이블
CREATE TABLE naver_auth (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- 고유 ID
    user_unique_id INT NOT NULL,                     -- 사용자 ID (users 테이블과 외래 키 관계)
    naver_id VARCHAR(255) NOT NULL,                  -- 네이버 고유 ID
    refresh_token TEXT NOT NULL,                     -- 네이버 리프레시 토큰
    expires_at TIMESTAMP,                            -- 엑세스 토큰 만료 시간
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 생성일시
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일시
    FOREIGN KEY (user_unique_id) REFERENCES users(user_unique_id)    -- users 테이블과 외래 키 관계
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블에 주석 추가
ALTER TABLE naver_auth COMMENT = '네이버 로그인 정보 테이블 (엑세스/리프레시 토큰 관리)';

-- 각 컬럼에 대한 주석 추가
ALTER TABLE naver_auth
    MODIFY id INT AUTO_INCREMENT COMMENT '테이블 고유 ID',
    MODIFY user_unique_id INT NOT NULL COMMENT '사용자 고유 ID (users 테이블과 외래 키 관계)',
    MODIFY naver_id VARCHAR(255) NOT NULL COMMENT '네이버 고유 ID',
    MODIFY refresh_token TEXT NOT NULL COMMENT '네이버 리프레시 토큰',
    MODIFY expires_at TIMESTAMP COMMENT '엑세스 토큰 만료 시간',
    MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    MODIFY updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시';


-- 3. 카카오 로그인 정보 테이블
CREATE TABLE kakao_auth (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- 고유 ID
    user_unique_id INT NOT NULL,                     -- 사용자 ID (users 테이블과 외래 키 관계)
    kakao_id VARCHAR(255) NOT NULL,                  -- 카카오 고유 ID
    refresh_token TEXT NOT NULL,                     -- 카카오 리프레시 토큰
    expires_at TIMESTAMP,                            -- 엑세스 토큰 만료 시간
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 생성일시
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일시
    FOREIGN KEY (user_unique_id) REFERENCES users(user_unique_id)    -- users 테이블과 외래 키 관계
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블에 주석 추가
ALTER TABLE kakao_auth COMMENT = '카카오 로그인 정보 테이블 (엑세스/리프레시 토큰 관리)';

-- 각 컬럼에 대한 주석 추가
ALTER TABLE kakao_auth
    MODIFY id INT AUTO_INCREMENT COMMENT '테이블 고유 ID',
    MODIFY user_unique_id INT NOT NULL COMMENT '사용자 고유 ID (users 테이블과 외래 키 관계)',
    MODIFY kakao_id VARCHAR(255) NOT NULL COMMENT '카카오 고유 ID',
    MODIFY refresh_token TEXT NOT NULL COMMENT '카카오 리프레시 토큰',
    MODIFY expires_at TIMESTAMP COMMENT '엑세스 토큰 만료 시간',
    MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    MODIFY updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시';


-- 4. 일반 로그인 정보 테이블
CREATE TABLE local_auth (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- 고유 ID
    user_unique_id INT NOT NULL,                     -- 사용자 ID (users 테이블과 외래 키 관계)
    local_id VARCHAR(255) NOT NULL,                  -- 로컬 사용자 ID (VARCHAR 타입으로 변경)
    username VARCHAR(255) NOT NULL,                  -- 일반 로그인 시 사용되는 아이디
    password VARCHAR(255) NOT NULL,                  -- 암호화된 비밀번호
    refresh_token TEXT,                              -- 자체 발급한 리프레시 토큰 (선택적)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 생성일시
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일시
    FOREIGN KEY (user_unique_id) REFERENCES users(user_unique_id)    -- users 테이블과 외래 키 관계
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블에 주석 추가
ALTER TABLE local_auth COMMENT = '일반 로그인 정보 테이블 (엑세스/리프레시 토큰 관리)';

-- 각 컬럼에 대한 주석 추가
ALTER TABLE local_auth
    MODIFY id INT AUTO_INCREMENT COMMENT '테이블 고유 ID',
    MODIFY user_unique_id INT NOT NULL COMMENT '사용자 고유 ID (users 테이블과 외래 키 관계)',
    MODIFY local_id VARCHAR(255) NOT NULL COMMENT '로컬 사용자 ID (VARCHAR 타입)',
    MODIFY username VARCHAR(255) NOT NULL COMMENT '일반 로그인 시 사용되는 아이디',
    MODIFY password VARCHAR(255) NOT NULL COMMENT '암호화된 비밀번호',
    MODIFY refresh_token TEXT COMMENT '자체 발급한 리프레시 토큰 (선택적)',
    MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    MODIFY updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시';

   
-- 객실 정보 테이블
CREATE TABLE rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT, -- 객실 ID (자동 증가)
    room_type VARCHAR(50) NOT NULL, -- 객실 유형 (예: 싱글룸, 더블룸, 스위트 등)
    title VARCHAR(255) NOT NULL, -- 객실 제목 (예: "럭셔리 오션뷰 스위트")
    description TEXT, -- 객실 설명
    notice TEXT, -- 안내사항 (예: 체크인/체크아웃 시간, 주의사항 등)
    capacity INT NOT NULL, -- 최대 수용 인원
    amenities_basic TEXT, -- 기본 편의시설 (WiFi, TV, 에어컨 등)
    amenities_bedroom TEXT, -- 침실 내 편의시설 (침대 유형, 옷장 등)
    amenities_bathroom TEXT, -- 욕실 내 편의시설 (샤워시설, 욕조 등)
    quantity INT NOT NULL DEFAULT 3, -- 객실 타입별 수량 (기본값 3)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 날짜
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- 수정 날짜
);

-- 객실 가격 테이블 (기간별 요금 관리)
CREATE TABLE room_prices (
    price_id INT PRIMARY KEY AUTO_INCREMENT, -- 가격 ID (자동 증가)
    room_id INT NOT NULL, -- 연결된 객실 ID (rooms 테이블 참조)
    season VARCHAR(50) NOT NULL, -- 시즌명 (예: 성수기, 비수기, 주말, 명절 등)
    start_date DATE NOT NULL, -- 가격 적용 시작 날짜
    end_date DATE NOT NULL, -- 가격 적용 종료 날짜
    price DECIMAL(10, 2) NOT NULL, -- 해당 기간의 1박 요금
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 날짜
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정 날짜
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- 예약 테이블 생성
CREATE TABLE reservation (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_number VARCHAR(36) NOT NULL UNIQUE, -- UUID 사용
    user_unique_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_adults INT NOT NULL,
    num_children INT DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    imp_uid VARCHAR(100) NOT NULL,         -- 아임포트에서 부여한 결제 고유 ID
    merchant_uid VARCHAR(100) NOT NULL,    -- 가맹점에서 부여한 주문 고유 ID
    pay_method VARCHAR(20) NOT NULL,       -- 결제 수단 (card, vbank 등)
    pg_provider VARCHAR(50) NOT NULL,      -- PG사 (kakaopay, tosspayments 등)
    pg_tid VARCHAR(100) NOT NULL,          -- PG사에서 발급한 거래 ID
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_unique_id) REFERENCES users(user_unique_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- 관심상품 테이블 생성
CREATE TABLE wishlist (
    wishlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_unique_id INT NOT NULL,
    room_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_unique_id) REFERENCES users(user_unique_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- 이미지 테이블 관리
CREATE TABLE images (
    image_id INT PRIMARY KEY AUTO_INCREMENT, -- 이미지 ID
    entity_type ENUM('hotel', 'room', 'facility', 'event', 'etc') NOT NULL, -- 이미지가 속한 유형
    entity_id INT NOT NULL, -- 호텔 ID 또는 객실 ID 저장
    image_url VARCHAR(255) NOT NULL, -- 이미지 URL
    is_main BOOLEAN DEFAULT FALSE, -- 대표 이미지 여부
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 생성 날짜
);

CREATE TABLE `facilities` (
  `facility_id` int(11) NOT NULL AUTO_INCREMENT,
  `facility_type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `info` mediumtext DEFAULT NULL,
  `regulation` mediumtext DEFAULT NULL,
  `location` mediumtext DEFAULT NULL,
  `period` mediumtext DEFAULT NULL,
  `hours_of_operation` mediumtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`facility_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `info` mediumtext DEFAULT NULL,
  `location` mediumtext DEFAULT NULL,
  `period` mediumtext DEFAULT NULL,
  `time` mediumtext DEFAULT NULL,
  `notice` mediumtext DEFAULT NULL,
  `composition` mediumtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `reservation_terms` (
  `reservation_id` int(11) NOT NULL,
  `term_id` int(11) NOT NULL,
  `is_agreed` varchar(1) NOT NULL,  -- 'Y' 또는 'N'
  PRIMARY KEY (`reservation_id`, `term_id`),
  CONSTRAINT `fk_reservation_terms_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reservation_terms_terms` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_mandatory` tinyint(1) NOT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `notices` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    `user_unique_id` INT NOT NULL,
    FOREIGN KEY (user_unique_id) REFERENCES users(user_unique_id) ON DELETE CASCADE
);
