const sequelize = require('./config/database'); // Sequelize 설정 파일 경로
const app = require('./app'); // app.js에서 작성한 app 객체 가져오기
const port = process.env.PORT || 3001;
const Users = require('./models/users');
const LocalAuth = require('./models/local_auth');
const NaverAuth = require('./models/naver_auth');
const KakaoAuth = require('./models/kakao_auth');
const Reservation = require('./models/reservations');
const Wishlist = require('./models/wishlists');
const RoomPrice = require('./models/room_prices');
const Room = require('./models/rooms');
const Facility = require('./models/facilities');
const Event = require('./models/events');
const Terms = require('./models/terms');
const ReservationTerms = require('./models/reservation_terms');
const Notice = require('./models/notices');
const Image = require('./models/images');

// Sequelize로 DB 연결 확인
sequelize.authenticate()
  .then(() => {
    console.log('데이터베이스 연결 성공.');
    // Users 모델을 정의하고 sequelize.authenticate()로 연결 후, 
    // Users.initiate(sequelize)로 모델을 초기화해야, Sequelize가 해당 모델을 사용해 쿼리를 실행할 수 있게 됨.
    Users.initiate(sequelize);
    LocalAuth.initiate(sequelize);
    NaverAuth.initiate(sequelize);
    KakaoAuth.initiate(sequelize);
    Reservation.initiate(sequelize);
    RoomPrice.initiate(sequelize);
    Room.initiate(sequelize);
    Wishlist.initiate(sequelize);
    Facility.initiate(sequelize);
    Event.initiate(sequelize);
    Terms.initiate(sequelize);
    ReservationTerms.initiate(sequelize); 
    Notice.initiate(sequelize); 
    Image.initiate(sequelize); // 추가된 모델 초기화

    // 관계 설정
    Users.hasOne(LocalAuth, {
      foreignKey: 'user_unique_id',
      sourceKey: 'user_unique_id',
      as: 'localAuth',
      onDelete: 'CASCADE',
    });
    LocalAuth.belongsTo(Users, {
      foreignKey: 'user_unique_id',
      targetKey: 'user_unique_id',
      as: 'user',
      onDelete: 'CASCADE',  // User 삭제 시 LocalAuth 삭제
    });
     NaverAuth.belongsTo(Users, {
      foreignKey: 'user_unique_id',
      targetKey: 'user_unique_id',
      as: 'user',
      onDelete: 'CASCADE',  // User 삭제 시 NaverAuth 삭제
    });
     KakaoAuth.belongsTo(Users, {
      foreignKey: 'user_unique_id',
      targetKey: 'user_unique_id',
      as: 'user',
      onDelete: 'CASCADE',  // User 삭제 시 KakaoAuth도 삭제
    });

    Room.hasMany(RoomPrice, {  // Room 모델은 여러 개의 RoomPrice를 가짐
      foreignKey: 'room_id',  // RoomPrice 모델에서 참조하는 외래 키
      as: 'roomPrice',  // 관계를 통해 접근할 alias 설정
    });
    // Room 모델에서 Reservation 모델을 가짐
    Room.hasMany(Reservation, {
      foreignKey: 'room_id',  // Reservation에서 참조하는 외래 키
      as: 'reservation',     // 관계를 통해 접근할 alias 설정
    });

    // Image와의 관계 설정 (1:N 관계)
    Room.hasMany(Image, {
      foreignKey: 'entity_id',
      constraints: false,
      scope: {
        entity_type: 'room', // 'room' 타입만 가져오기
      },
    });
    // Room 모델과의 관계 설정 (N:1 관계)
    Image.belongsTo(Room, {
      foreignKey: 'entity_id',
      constraints: false,
    });

    Reservation.belongsTo(Room, {
      foreignKey: 'room_id',
      targetKey: 'room_id',
      as: 'room',
    });
    RoomPrice.belongsTo(Room, {
      foreignKey: 'room_id',
      targetKey: 'room_id',
      as: 'room',
    });
    // Users와 Reservation의 관계 설정
    Users.hasMany(Reservation, {
      foreignKey: 'user_unique_id',  // Reservation 모델에서 참조하는 외래 키
      as: 'reservations',  // 관계를 통해 접근할 alias 설정
      onDelete: 'CASCADE', // User 삭제 시 관련된 Reservation도 삭제
    });

    Reservation.belongsTo(Users, {
      foreignKey: 'user_unique_id',
      targetKey: 'user_unique_id',
      as: 'user',
    });

    Users.hasMany(Wishlist, {
      foreignKey: 'user_unique_id',  // Reservation 모델에서 참조하는 외래 키
      as: 'wishlist',  // 관계를 통해 접근할 alias 설정
      onDelete: 'CASCADE', // User 삭제 시 관련된 Reservation도 삭제
    });

    Wishlist.belongsTo(Users, {
      foreignKey: 'user_unique_id',
      targetKey: 'user_unique_id',
      as: 'user',
    });
    
    Room.hasOne(Wishlist, {  // Room과 Wishlist는 1:1 관계
      foreignKey: 'room_id',
      as: 'roomWishlist',
      onDelete: 'CASCADE',
    });
    Wishlist.belongsTo(Room, {  // Wishlist는 Room에 속함
      foreignKey: 'room_id',
      targetKey: 'room_id',
      as: 'room',
    });

    // 예약과 약관 관계 설정 (다대다 관계)
    Reservation.hasMany(ReservationTerms, {
      foreignKey: 'reservation_id',
      as: 'reservationTerms',
      onDelete: 'CASCADE',
    });
    ReservationTerms.belongsTo(Reservation, {
      foreignKey: 'reservation_id',
      targetKey: 'reservation_id',
      as: 'reservation',
    });

    Terms.hasMany(ReservationTerms, {
      foreignKey: 'term_id',
      as: 'reservationTerms',
      onDelete: 'CASCADE',
    });
    ReservationTerms.belongsTo(Terms, {
      foreignKey: 'term_id',
      targetKey: 'id',
      as: 'terms',
    });

    // Image와의 관계 설정 (1:N 관계)
    Facility.hasMany(Image, {
      foreignKey: 'entity_id',
      constraints: false,
      scope: {
        entity_type: 'facility', // 'facility' 타입만 가져오기
      },
    });
    // Facility 모델과의 관계 설정 (N:1 관계)
    Image.belongsTo(Facility, {
      foreignKey: 'entity_id',
      constraints: false,
    });

    // Image와의 관계 설정 (1:N 관계)
    Event.hasMany(Image, {
      foreignKey: 'entity_id',
      constraints: false,
      scope: {
        entity_type: 'event', // 'event' 타입만 가져오기
      },
    });
    // Facility 모델과의 관계 설정 (N:1 관계)
    Image.belongsTo(Event, {
      foreignKey: 'entity_id',
      constraints: false,
    });


    // 관계 설정
    Users.hasMany(Notice, {
      foreignKey: 'user_unique_id',
      sourceKey: 'user_unique_id',
      as: 'notices',
      onDelete: 'CASCADE',  // User 삭제 시 Notice도 삭제
    });

    Notice.belongsTo(Users, {
      foreignKey: 'user_unique_id',
      targetKey: 'user_unique_id',
      as: 'user',
      onDelete: 'CASCADE',  // User 삭제 시 Notice 삭제
    });

    Reservation.hasMany(Image, {
      foreignKey: 'entity_id',
      sourceKey: 'room_id',
      as: 'roomImages',
      constraints: false,
      scope: {
        entity_type: 'room',
      },
    });
    
    Image.belongsTo(Reservation, {
      foreignKey: 'entity_id',
      targetKey: 'room_id',
      constraints: false,
    });

    Wishlist.hasMany(Image, {
      foreignKey: 'entity_id',
      sourceKey: 'room_id',
      as: 'Images',
      constraints: false,
      scope: {
        entity_type: 'room',
      },
    });
    
    Image.belongsTo(Wishlist, {
      foreignKey: 'entity_id',
      targetKey: 'room_id',
      constraints: false,
    });

    console.log('모델 및 관계 초기화 성공.');
    
    
  })
  .catch(err => {
    console.error('데이터베이스 연결 실패:', err);
  });

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 HTTP로 실행 중.`);
});
