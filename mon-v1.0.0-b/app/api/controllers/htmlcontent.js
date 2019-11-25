module.exports = function htmlcontent(username,data){
   let transactionType = '';
   switch (data.capture_type) {
      case 'vt':
         transactionType='Virtual Terminal';
         break;
      default:
         break;
   }
return `<html xmlns="http://www.w3.org/1999/xhtml">
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   <title>Monarch - The compliance platform for the Cannibis industry</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0;">
   <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tbody>
         <tr>
            <td style="padding: 10px 0 30px 0;">
               <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                  <tbody>
                     <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 25px 28px 25px 0;">
                           <img src="http://dev.monarch-dev.com/static/media/monarchlogo.png" width="150" alt="Monarch" style="display: block; width: 23%;"><br><br>
                           <span class="email-text-header" style="font-size: 21px;color: #ffffff;">Transaction submitted through ${transactionType}</span>
                        </td>
                     </tr>
                     <tr>
                        <td align="center">
                        </td>
                     </tr>
                     <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                           <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tbody>
                                 <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                       <b>Hi, ${username.split(' ')[0]}</b>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td style="padding: 20px 0 10px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; ">
                                       We got a transaction from your side. The transaction which you sent
                                       to us has been submitted successfully. The details which you sent to
                                       us are mentioned below.
                                    </td>
                                 </tr>
                                 <tr>
                                    <td style="padding: 20px 0 10px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                       As per your submission your transaction id is ${data.transactionId}.
                                    </td>
                                 </tr>
                                 <tr>
                                    <td>
                                       <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                          <tbody>
                                             <tr>
                                                <td width="260" valign="top">
                                                   <div style="column-count: 3; margin-bottom: 11px">
                                                      <h4 style="margin: 7px 0 0 0;">Total Amount : $ ${data.initial_amount}</h4>
                                                      <h4 style="font-size: larger;">Transaction Details</h4>
                                                      <a href="${data.transacLink}" style="background: #c56464; color: white; padding: 6px 6px 6px 6px; border-radius: 7px; border: #c56464; float: right; ">
                                                      Navigate to transaction
                                                      </a>
                                                   </div>
                                                   <div style="background: #607b86; padding: 7px 11px 7px 17px; border-radius: 6px; color: azure; ">
                                                      <div style="margin: 7px 0px 7px 0;">
                                                         <span style="font-size: 13px;font-weight: 500;">Company Name:</span> 
                                                         <span style="font-size: 13px;"> ${data.companyname}</span>
                                                      </div>
                                                      <div style="margin: 7px 0px 7px 0;">
                                                         <span style="font-size: 13px;font-weight: 500;">Customer Email:</span> 
                                                         <span style="font-size: 13px;"> ${data.custemail}</span>
                                                      </div>
                                                      <div style="margin: 7px 0px 7px 0;">
                                                         <span style="font-size: 13px;font-weight: 500;">Account Number:</span> 
                                                         <span style="font-size: 13px;"> ${data.enc_acct}</span>
                                                      </div>
                                                      <div style="margin: 7px 0px 7px 0;">
                                                         <span style="font-size: 13px;font-weight: 500;">Routing Number:</span> 
                                                         <span style="font-size: 13px;"> ${data.chk_aba}</span>
                                                      </div>
                                                      <div style="margin: 7px 0px 7px 0;">
                                                         <span style="font-size: 13px;font-weight: 500;">Initial Amount:</span> 
                                                         <span style="font-size: 13px;"> ${data.initial_amount}</span>
                                                      </div>
                                                      <div style="margin: 7px 0px 7px 0;">
                                                         <span style="font-size: 13px;font-weight: 500;">Comment:</span> 
                                                         <span style="font-size: 13px;"> ${data.comments}</span>
                                                      </div>
                                                   </div>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                     <tr>
                        <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                           <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tbody>
                                 <tr>
                                    <td align="center" width="25%" style="color: white">
                                       Copyright © ${new Date().getFullYear()} Monarch Inc. All rights reserved.
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
</body>
</html>`;
}