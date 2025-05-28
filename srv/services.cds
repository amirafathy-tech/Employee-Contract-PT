using {my.company as my} from '../db/schema';

service ContractService {
  entity Employees         as projection on my.Employee;
  entity Managers          as projection on my.Manager;
 // entity ExpiringContracts as projection on my.ExpiringContractsView;
 entity ExpiringContracts as projection on my.ExpiringContractsView {
    key ID,
    name,
    email,
    contractEndDate,
    contractType,
    status,
    manager_ID,
    manager_name,
    manager_email
  };

// action CheckExpiringContracts() returns Integer;
// action CheckExpiringContracts() returns array of Employees;

// action ContractRenewal(
//   employeeID: UUID
// ) returns String;

// action NonRenewal(
//   employeeID: UUID
// ) returns String;

// action RenewalWithStatusChange(
//   employeeID: UUID,
//   newType: String
// ) returns String;
}
