INSERT INTO "my_company_Employee" (ID, name, email, manager, contractEndDate, status, contractType) VALUES
('e1', 'John Doe', 'john.doe@example.com', 'm1', '2025-07-15', 'active', 'Annual'),
('e2', 'Jane Smith', 'jane.smith@example.com', 'm2', '2025-08-20', 'active', '6-months'),
('e3', 'Alice Johnson', 'alice.johnson@example.com', 'm1', '2025-06-30', 'active', 'Annual');

INSERT INTO "my_company_Manager" (ID, name, email) VALUES
('m1', 'AMIRA', 'amira.fathy@solex.tech'),
('m2', 'Eman', 'eman.ayman@solex.tech');

SELECT * FROM "88940FE5376A46AAB5DC1C211E16174B"."my_company_Employee";

SELECT * 
FROM "88940FE5376A46AAB5DC1C211E16174B"."MY_COMPANY_EMPLOYEE" e
LEFT JOIN 
    "88940FE5376A46AAB5DC1C211E16174B"."MY_COMPANY_MANAGER" m
ON 
    e.manager_ID = m.ID
WHERE 
    e.contractEndDate >= '2025-05-22'
    AND e.contractEndDate <= '2025-08-22'
    AND e.status = 'active';


SELECT * FROM "88940FE5376A46AAB5DC1C211E16174B"."CONTRACTSERVICE.EXPIRINGCONTRACTS";

SELECT TOP 1000
	"ID",
	"NAME",
	"EMAIL",
	"CONTRACTENDDATE",
	"CONTRACTTYPE",
	"STATUS",
	"MANAGER_ID",
	"MANAGER_NAME",
	"MANAGER_EMAIL"
FROM "88940FE5376A46AAB5DC1C211E16174B"."CONTRACTSERVICE_EXPIRINGCONTRACTS"