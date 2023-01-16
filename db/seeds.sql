INSERT INTO department (name)
VALUES ("Marketing"),
       ("Brainstorm"),
       ("Mailroom"),
       ("Forklift");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Marketer", 125000, 1),
       ("Marketer", 75000, 1),
       ("Lead Brainstorm", 300000, 2),
       ("Average Brainstorm", 175000, 2),
       ("Lead Mailroom Tech", 65000, 3),
       ("Mailroom Tech", 45000, 3),
       ("Lead Forklift", 95000, 4),
       ("Forklift Driver", 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Henry", "Cavill", 1, null),
       ("Brad", "Pitt", 1, 1),
       ("Mark", "Zuckerburg", 2, null),
       ("Jamie", "Fox", 3, 3),
       ("Chadwick", "Boseman", 4, null),
       ("Daniel", "Radcliff", 5, 5),
       ("Andrew", "Garfield", 6, null),
       ("Tom", "Holland", 7, 7);