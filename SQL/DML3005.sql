-- Populates the Database
INSERT INTO Member(Name, Email) 
VALUES ('Nour', 'Nour@carleton.ca'),
       ('Ana', 'Ana@carleton.ca'),
       ('ShingShang', 'ShingShang@carleton.ca'),
       ('Cat', 'Cat@carleton.ca'),
       ('Nikita', 'Nikita@carleton.ca');

INSERT INTO Payment(Member_ID, Service) 
VALUES (1, 'Massage'),
       (2, 'Yoga'),
       (3, 'Hot Yoga'),
       (4, 'Swimming'),
       (5, 'Weight Training');

INSERT INTO Trainer(Name, Email, Specialization, Clock_In, Clock_out) 
VALUES ('Boss McBossMan', 'Boss@job.ca','Message', '09:00:00', '17:00:00'),
       ('Toronto Mans', 'Toronto@job.ca', 'Yoga', '09:00:00', '17:00:00'),
       ('Alex Vo', 'Alex@job.ca', 'Hot Yoga', '09:00:00', '17:00:00'),
       ('Nathaniel Liao-Park', 'Nathaniel@job.ca', 'Swimming', '09:00:00', '17:00:00'),
       ('Nik Nemec', 'Nik@job.ca', 'Weight Training', '09:00:00', '17:00:00');

INSERT INTO Room(Room_ID) 
VALUES (1),
       (2),
       (3),
       (4),
       (5);

INSERT INTO Equipment(Equipment_Type, Maintenance_Date) 
VALUES ('Yoga Mats','2022-06-13'),
       ('Weights','2022-06-13'),
       ('Pool Floaties','2022-06-13'),
       ('Rope','2022-06-13'),
       ('Kettle Bells','2022-06-13');

INSERT INTO Exercises(Name) 
VALUES ('Back Flips'),
       ('Jump Rope'),
       ('The TouTou'),
       ('Bouncing'),
       ('Running');

INSERT INTO Member_Schedule(Member_ID, Start_Time, End_Time, Date, Name, Trainer_Name, Equipment_Type, Room)
VALUES (1,'10:00:00', '11:00:00', '2024-04-18', 'Back Flips', 'Boss McBossMan', 'Yoga Mats', 1),
       (2,'10:00:00', '11:00:00', '2024-04-18', 'Jump Rope', 'Toronto Mans', 'Weights', 2),
       (3,'10:00:00', '11:00:00', '2024-04-18', 'The TouTou', 'Alex Vo', 'Pool Floaties', 3),
       (4,'10:00:00', '11:00:00', '2024-04-18', 'Bouncing', 'Nathaniel Liao-Park', 'Rope', 4),
       (5,'10:00:00', '11:00:00', '2024-04-18', 'Running', 'Nik Nemec', 'Kettle Bells', 5);

INSERT INTO Schedule(Start_Time, End_Time, Date, Trainer_Name, Name, Room, Member_ID) 
VALUES ('10:00:00', '11:00:00', '2024-04-18', 'Boss McBossMan', 'Back Flips', 1, 1),
       ('10:00:00', '11:00:00', '2024-04-19', 'Toronto Mans', 'Jump Rope', 2, 2),
       ('10:00:00', '11:00:00', '2024-04-20', 'Alex Vo', 'The TouTou', 3, 3),
       ('10:00:00', '11:00:00', '2024-04-21', 'Nathaniel Liao-Park', 'Bouncing', 4, 4),
       ('10:00:00', '11:00:00', '2024-04-22', 'Nik Nemec', 'Running', 5, 5);

INSERT INTO Profile(Weight, Height, Gender, Age, Goal_Weight, Member_ID) 
VALUES (92, 150, 'Female', 20, NULL, 1),
       (112.3, 160, 'Female', 20, NULL, 2),
       (130, 157, 'Female', 20, NULL, 3),
       (107, 150, 'Female', 20, NULL, 4),
       (126, 150, 'Female', 20, NULL, 5);


INSERT INTO Admin(Name, Email) 
VALUES ('Ken Zou', 'Ken@job.ca'),
       ('Edmund Yee', 'Edmund@job.ca'),
       ('Jing Kook', 'Jing@job.ca'),
       ('Jessica Hood', 'Jessica@job.ca'),
       ('Paris Vasiliou', 'Paris@job.ca');
