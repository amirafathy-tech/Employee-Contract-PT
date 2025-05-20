const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { Employee, Manager } = this.entities;

  // this.on('CheckExpiringContracts', async () => {
  //   const tx = cds.transaction(this);
  //   const today = new Date();
  //   const next3Months = new Date(today);
  //   next3Months.setMonth(today.getMonth() + 3);

  //   const employees = await tx.run(
  //     SELECT.from(Employee).where({
  //       contractEndDate: { '>=': today, '<=': next3Months },
  //       status: 'active'
  //     })
  //   );

  //   for (const emp of employees) {
  //     const manager = await tx.run(SELECT.one.from(Manager).where({ ID: emp.manager_ID }));
  //     console.log(`Notify manager ${manager.name} <${manager.email}>: ${emp.name}'s contract ends on ${emp.contractEndDate}`);
  //   }

  //   // return employees.length;
  //   return employees; // Return employee and manager details
  // });


  this.on('CheckExpiringContracts', async () => {
    const tx = cds.transaction(this);
    const today = new Date();
    const next3Months = new Date(today);
    next3Months.setMonth(today.getMonth() + 3);

    const employees = await tx.run(
      SELECT.from(Employee)
        .columns('ID', 'name', 'email', 'contractEndDate', 'contractType', 'status', 'manager.ID', 'manager.name', 'manager.email')
        .where({
          contractEndDate: { '>=': today, '<=': next3Months },
          status: 'active'
        })
    );

    for (const emp of employees) {
      if (!emp.manager_ID) {
        emp.manager_name = 'N/A';
        emp.manager_email = 'N/A';
      }
      console.log(`Notify manager ${emp.manager_name} <${emp.manager_email}>: ${emp.name}'s contract ends on ${emp.contractEndDate}`);
    }

    return employees;
  });

  this.on('ContractRenewal', async ({ data: { employeeID } }) => {
    const tx = cds.transaction(this);
    const updated = await tx.run(
      UPDATE(Employee)
        .set({ contractEndDate: _addMonths(new Date(), 12) })
        .where({ ID: employeeID })
    );
    return updated ? 'Contract renewed for 12 months' : 'Employee not found';
  });

  this.on('NonRenewal', async ({ data: { employeeID } }) => {
    const tx = cds.transaction(this);
    const updated = await tx.run(
      UPDATE(Employee)
        .set({ status: 'terminated' })
        .where({ ID: employeeID })
    );
    return updated ? 'Employee terminated' : 'Employee not found';
  });

  this.on('RenewalWithStatusChange', async ({ data: { employeeID, newType } }) => {
    const tx = cds.transaction(this);
    const months = newType === '6-months' ? 6 : 12;
    const updated = await tx.run(
      UPDATE(Employee)
        .set({
          contractType: newType,
          contractEndDate: _addMonths(new Date(), months)
        })
        .where({ ID: employeeID })
    );
    return updated ? `Contract updated to ${newType}` : 'Employee not found';
  });
});

function _addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}
