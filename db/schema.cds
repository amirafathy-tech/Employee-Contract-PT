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