// const cds = require('@sap/cds');

// module.exports = cds.service.impl(async function () {
//   const { Employee, Manager } = this.entities;

//   // const { ExpiringContracts } = this.entities;

//   //   this.on('CheckExpiringContracts', async (req) => {
//   //       try {
//   //           const contracts = await SELECT.from(ExpiringContracts);
//   //           return contracts;
//   //       } catch (error) {
//   //           req.error(500, `Error fetching expiring contracts: ${error.message}`);
//   //       }
//   //   });

//   // this.on('CheckExpiringContracts', async () => {
//   //   const tx = cds.transaction(this);
//   //   const today = new Date();
//   //   const next3Months = new Date(today);
//   //   next3Months.setMonth(today.getMonth() + 3);

//   //   const employees = await tx.run(
//   //     SELECT.from(Employee).where({
//   //       contractEndDate: { '>=': today, '<=': next3Months },
//   //       status: 'active'
//   //     })
//   //   );

//   //   for (const emp of employees) {
//   //     const manager = await tx.run(SELECT.one.from(Manager).where({ ID: emp.manager_ID }));
//   //     console.log(`Notify manager ${manager.name} <${manager.email}>: ${emp.name}'s contract ends on ${emp.contractEndDate}`);
//   //   }

//   //   // return employees.length;
//   //   return employees; // Return employee and manager details
//   // });


//   // this.on('CheckExpiringContracts', async () => {
//   //   const tx = cds.transaction(this);
//   //   const today = new Date();
//   //   const next3Months = new Date(today);
//   //   next3Months.setMonth(today.getMonth() + 3);

//   //   const employees = await tx.run(
//   //     SELECT.from(Employee)
//   //       .columns('ID', 'name', 'email', 'contractEndDate', 'contractType', 'status', 'manager.ID', 'manager.name', 'manager.email')
//   //       .where({
//   //         contractEndDate: { '>=': today, '<=': next3Months },
//   //         status: 'active'
//   //       })
//   //   );

//   //   for (const emp of employees) {
//   //     if (!emp.manager_ID) {
//   //       emp.manager_name = 'N/A';
//   //       emp.manager_email = 'N/A';
//   //     }
//   //     console.log(`Notify manager ${emp.manager_name} <${emp.manager_email}>: ${emp.name}'s contract ends on ${emp.contractEndDate}`);
//   //   }

//   //   return employees;
//   // });

//   // this.on('ContractRenewal', async ({ data: { employeeID } }) => {
//   //   const tx = cds.transaction(this);
//   //   const updated = await tx.run(
//   //     UPDATE(Employee)
//   //       .set({ contractEndDate: _addMonths(new Date(), 12) })
//   //       .where({ ID: employeeID })
//   //   );
//   //   return updated ? 'Contract renewed for 12 months' : 'Employee not found';
//   // });

//   // this.on('NonRenewal', async ({ data: { employeeID } }) => {
//   //   const tx = cds.transaction(this);
//   //   const updated = await tx.run(
//   //     UPDATE(Employee)
//   //       .set({ status: 'terminated' })
//   //       .where({ ID: employeeID })
//   //   );
//   //   return updated ? 'Employee terminated' : 'Employee not found';
//   // });

//   // this.on('RenewalWithStatusChange', async ({ data: { employeeID, newType } }) => {
//   //   const tx = cds.transaction(this);
//   //   const months = newType === '6-months' ? 6 : 12;
//   //   const updated = await tx.run(
//   //     UPDATE(Employee)
//   //       .set({
//   //         contractType: newType,
//   //         contractEndDate: _addMonths(new Date(), months)
//   //       })
//   //       .where({ ID: employeeID })
//   //   );
//   //   return updated ? `Contract updated to ${newType}` : 'Employee not found';
//   // });
// });

// function _addMonths(date, months) {
//   const d = new Date(date);
//   d.setMonth(d.getMonth() + months);
//   return d.toISOString().split('T')[0];
// }



const cds = require('@sap/cds');
const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const app = express();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP host (e.g., Gmail, Outlook)
  port: 587,
  secure: false,
  auth: {
    user: 'fathyamira689@gmail.com', // Replace with your email
    pass: '' // Use an app-specific password if 2FA is enabled
  }
});

// const fetchExpiringContracts = async () => {
//   try {
//     const response = await cds.connect.to('ContractService').get('/ExpiringContracts');
//     console.log(response);
    
//     return response;
//   } catch (error) {
//     console.error('Error fetching expiring contracts:', error);
//     return [];
//   }
// };

const fetchExpiringContracts = async () => {
  try {
    // Mock data for local testing
    return [
      {
        ID: 'e1',
        name: 'John Doe',
        email: 'john@example.com',
        contractEndDate: '2025-08-15',
        contractType: 'annually',
        status: 'active',
        manager_ID: 'm1',
        manager_name: 'Amira Manager',
        manager_email: 'amira.fathy@solex-tech.com'
      }
    ];
  } catch (error) {
    console.error('Error fetching expiring contracts:', error);
    return [];
  }
};

const sendEmail = async (managerEmail, employeeData) => {
  const mailOptions = {
    from: 'fathyamira689@gmail.com',
    to: managerEmail,
    subject: 'Contract Expiry Notification',
    html: `
      <h2>Contract Expiry Notification</h2>
      <p>Dear ${employeeData.manager_name},</p>
      <p>The following employee under your management has a contract expiring within the next 3 months:</p>
      <ul>
        <li><strong>Name:</strong> ${employeeData.name}</li>
        <li><strong>Email:</strong> ${employeeData.email}</li>
        <li><strong>Contract End Date:</strong> ${employeeData.contractEndDate}</li>
        <li><strong>Contract Type:</strong> ${employeeData.contractType}</li>
        <li><strong>Status:</strong> ${employeeData.status}</li>
      </ul>
      <p>Please take necessary action.</p>
      <p>Best regards,<br>Your HR Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${managerEmail}`);
  } catch (error) {
    console.error(`Failed to send email to ${managerEmail}:`, error);
  }
};

const scheduleJob = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Running contract expiry notification job...');
    const contracts = await fetchExpiringContracts();

    // Group contracts by manager_email to send one email per manager
    const managerEmails = {};
    contracts.forEach(contract => {
      if (!managerEmails[contract.manager_email]) {
        managerEmails[contract.manager_email] = [];
      }
      managerEmails[contract.manager_email].push(contract);
    });

    for (const [managerEmail, employeeList] of Object.entries(managerEmails)) {
      // Send a single email per manager with all their employees
      const htmlContent = `
        <h2>Contract Expiry Notification</h2>
        <p>Dear ${employeeList[0].manager_name},</p>
        <p>The following employees under your management have contracts expiring within the next 3 months:</p>
        <ul>
          ${employeeList.map(emp => `
            <li>
              <strong>Name:</strong> ${emp.name}<br>
              <strong>Email:</strong> ${emp.email}<br>
              <strong>Contract End Date:</strong> ${emp.contractEndDate}<br>
              <strong>Contract Type:</strong> ${emp.contractType}<br>
              <strong>Status:</strong> ${emp.status}
            </li>
          `).join('')}
        </ul>
        <p>Please take necessary action.</p>
        <p>Best regards,<br>Your HR Team</p>
      `;
      const mailOptions = {
        from: 'fathyamira689@gmail.com',
        to: managerEmail,
        subject: 'Contract Expiry Notification',
        html: htmlContent
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${managerEmail}`);
      } catch (error) {
        console.error(`Failed to send email to ${managerEmail}:`, error);
      }
    }
  }, {
    scheduled: true,
    timezone: 'Africa/Cairo' // Adjust to your timezone
  });
};


// Add a manual test route
app.get('/test-job', async (req, res) => {
  console.log('Manually triggering test job...');
  const contracts = await fetchExpiringContracts();

  if (contracts.length === 0) {
    res.send('No expiring contracts found.');
    return;
  }

  const managerEmails = {};
  contracts.forEach(contract => {
    if (!managerEmails[contract.manager_email]) {
      managerEmails[contract.manager_email] = [];
    }
    managerEmails[contract.manager_email].push(contract);
  });

  for (const [managerEmail, employeeList] of Object.entries(managerEmails)) {
    const htmlContent = `
      <h2>Contract Expiry Notification</h2>
      <p>Dear ${employeeList[0].manager_name},</p>
      <p>The following employees under your management have contracts expiring within the next 3 months:</p>
      <ul>
        ${employeeList.map(emp => `
          <li>
            <strong>Name:</strong> ${emp.name}<br>
            <strong>Email:</strong> ${emp.email}<br>
            <strong>Contract End Date:</strong> ${emp.contractEndDate}<br>
            <strong>Contract Type:</strong> ${emp.contractType}<br>
            <strong>Status:</strong> ${emp.status}
          </li>
        `).join('')}
      </ul>
      <p>Please take necessary action.</p>
      <p>Best regards,<br>Your HR Team</p>
    `;
    const mailOptions = {
      from: 'fathyamira689@gmail.com',
      to: managerEmail,
      subject: 'Contract Expiry Notification (Test)',
      html: htmlContent
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Test email sent to ${managerEmail}`);
    } catch (error) {
      console.error(`Failed to send test email to ${managerEmail}:`, error);
    }
  }
  res.send('Test job triggered. Check your email for notifications.');
});


// Start the server and schedule the job
cds.on('bootstrap', (app) => {
  scheduleJob();
});

cds.serve('all').with(express).in(app).catch(err => {
  console.error(err);
  process.exit(1);
});
