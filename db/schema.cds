namespace my.company;

entity Employee {
  key ID: String;
  name: String;
  email: String;
  contractEndDate: Date;
  contractType: String; // annually, 6-months
  status: String;       // active, terminated
  manager: Association to Manager;
}

entity Manager {
  key ID: UUID;
  name: String;
  email: String;
}
view ExpiringContractsView as
  select from Employee as e
  left join Manager as m
    on e.manager.ID = m.ID
  {
    e.ID,
    e.name,
    e.email,
    e.contractEndDate,
    e.contractType,
    e.status,
    m.ID as manager_ID,
    m.name as manager_name,
    m.email as manager_email
  }
  where
    e.contractEndDate >= $now and
    e.contractEndDate <= add_months($now, 3) and
    e.status = 'active';
 