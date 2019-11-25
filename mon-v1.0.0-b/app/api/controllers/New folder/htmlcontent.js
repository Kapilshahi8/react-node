module.exports = function htmlcontent(username,data){
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
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
                        style="border: 1px solid #cccccc; border-collapse: collapse;">
                        <tbody>
                            <tr>
                                <td align="center" bgcolor="#70bbd9"
                                    style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                                    <img src="http://192.168.42.11/monarch/static/media/logo-inverse.36765f2b.png" alt="Monarch" style="display: block; float: left; padding: 0px 0px 0 29px; width:140px !important"><span                                        class="email-text-header" style="font-size: 24px;color: white;">Transaction submitted through ${data.capture_type}</span></td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <td
                                                    style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                                    <b>Hi, ${username}</b></td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="padding: 20px 0 10px 0;color: #153643;font-family: Arial, sans-serif;font-size: 16px;line-height: 20px;">
                                                    We got a transaction from your side. The transaction which you sent
                                                    to us has been submitted successfully. The details which you sent to
                                                    us are mentioned below.</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tbody>
                                                            <tr>
                                                                <td width="260" valign="top">
                                                                    <div style="column-count: 3;margin-bottom: 11px">
                                                                        <h4 style="margin: 7px 0 0 0;">Total Amount : &#36; ${data.initial_amount}</h4>
                                                                        <h4 style="font-size: larger;">Transaction Details</h4>
                                                                        <a href="${data.transacLink}" style="background: #c56464;color: white;padding: 6px 6px 6px 6px;border-radius: 7px;border: #c56464;float: right;">
                                                                            Navigate to transaction
                                                                        </a>
                                                                    </div>
                                                                    <div style="background: #9cccc72b;padding: 7px 29px 7px 29px;border-radius: 6px;">
                                                                        <div style="column-count:2;">
                                                                            <div>
                                                                                <span style="font-size: 13px;font-weight: 500;">Company Name:</span> 
                                                                                <span style="font-size: 13px;"> ${data.companyname}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span style="font-size: 13px;font-weight: 500;">Customer Name:</span> 
                                                                                <span style="font-size: 13px;"> ${data.custname}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span style="font-size: 13px;font-weight: 500;">Customer Phone:</span> 
                                                                                <span style="font-size: 13px;"> ${data.custphone}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span style="font-size: 13px;font-weight: 500;">Customer Email:</span> 
                                                                                <span style="font-size: 13px;"> ${data.custemail}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div style="margin: 4px 0px 4px 0;">
                                                                            <span style="font-size: 13px;font-weight: 500;">Address 1:</span>
                                                                            <span style="font-size: 13px;">
                                                                                ${data.custaddress1}
                                                                            </span>
                                                                        </div>
                                                                        <div style="margin: 4px 0px 4px 0;">
                                                                            <span style="font-size: 13px;font-weight: 500;">Address 2:</span> 
                                                                            <span style="font-size: 13px;"> ${data.custaddress2}</span>
                                                                        </div>
                                                                        <div style="column-count:2;">
                                                                            <div style="margin: 4px 0px 4px 0;">
                                                                                <span style="font-size: 13px;font-weight: 500;">City:</span> 
                                                                                <span style="font-size: 13px;"> ${data.custcity}</span>
                                                                            </div>
                                                                            <div style="margin: 4px 0px 4px 0;">
                                                                                <span style="font-size: 13px;font-weight: 500;">State Province:</span> 
                                                                                <span style="font-size: 13px;"> ${data.custstate}</span>
                                                                            </div>
                                                                            <div style="margin: 4px 0px 4px 0;">
                                                                                <span style="font-size: 13px;font-weight: 500;">Zip Code:</span> 
                                                                                <span style="font-size: 13px;"> ${data.custzip}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div style="column-count: 2;">
                                                                            <div style="margin: 4px 0px 4px 0;">
                                                                                <span style="font-size: 13px;font-weight: 500;">Account Number:</span> 
                                                                                <span style="font-size: 13px;"> ${data.enc_acct}</span>
                                                                            </div>
                                                                            <div style="margin: 4px 0px 4px 0;">
                                                                                <span style="font-size: 13px;font-weight: 500;">Routing Number:</span> 
                                                                                <span style="font-size: 13px;"> ${data.chk_aba}</span>
                                                                            </div>
                                                                            <div style="margin: 4px 0px 4px 0;">
                                                                                <span style="font-size: 13px;font-weight: 500;">Initial Amount:</span> 
                                                                                <span style="font-size: 13px;"> ${data.initial_amount}</span>
                                                                            </div>
                                                                            <div style="margin: 4px 0px 4px 0;">
                                                                                <span style="font-size: 13px;font-weight: 500;">Comment:</span> 
                                                                                <span style="font-size: 13px;"> ${data.comments}</span>
                                                                            </div>
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
                                                <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;"
                                                    width="75%">® Someone, somewhere 2013<br><a href="#"
                                                        style="color: #ffffff;" <font color="#ffffff">Unsubscribe</font>
                                                    </a> to this newsletter instantly</td>
                                                <td align="right" width="25%">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                                    <a href="http://www.twitter.com/"
                                                                        style="color: #ffffff;"><img
                                                                            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/tw.gif"
                                                                            alt="Twitter" width="38" height="38"
                                                                            style="display: block;" border="0"></a></td>
                                                                <td style="font-size: 0; line-height: 0;" width="20">
                                                                    &nbsp;</td>
                                                                <td
                                                                    style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                                    <a href="http://www.twitter.com/"
                                                                        style="color: #ffffff;"><img
                                                                            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/fb.gif"
                                                                            alt="Facebook" width="38" height="38"
                                                                            style="display: block;" border="0"></a></td>
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
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`;
}