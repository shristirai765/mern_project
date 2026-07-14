// Generate HTML template for Account Created email
const formatDate = (createdAt: NativeDate)=>{
    const formattedDate = new Date(createdAt).toLocaleString("en=US",{
        dateStyle: "long",
        timeStyle: "short",
    });
    return formattedDate;
}
export const accountCreatedHtml = ({
  full_name,
  createdAt,
  email,
}: {
  full_name: string;
  createdAt: Date;
  email: string;
}) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Created</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f3ff; font-family:Arial, Helvetica, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
              <td align="center">

                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

                      <!-- Header -->
                      <tr>
                          <td align="center" style="background:#7c3aed; padding:30px;">
                              <h1 style="color:#ffffff; margin:0; font-size:28px;">
                                  🎉 Account Created
                              </h1>
                          </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                          <td style="padding:40px; color:#333333;">

                              <h2 style="margin-top:0;">
                                  Hello ${full_name},
                              </h2>

                              <p style="font-size:16px; line-height:1.6;">
                                  Welcome! Your account has been successfully created.
                                  We're excited to have you join us.
                              </p>

                              <table cellpadding="10" cellspacing="0" width="100%" style="margin:30px 0; border:1px solid #ede9fe; border-radius:8px; background:#faf5ff;">
                                  <tr>
                                      <td><strong>Name</strong></td>
                                      <td>${full_name}</td>
                                  </tr>

                                  <tr>
                                      <td><strong>Email</strong></td>
                                      <td>${email}</td>
                                  </tr>

                                  <tr>
                                      <td><strong>Created At</strong></td>
                                         <td>${formatDate(createdAt)}</td>

                                  </tr>
                              </table>

                              <p style="font-size:16px; line-height:1.6;">
                                  You can now sign in and start exploring all the features available to you.
                              </p>

                              <div style="text-align:center; margin:40px 0;">
                                  <a href="#"
                                     style="display:inline-block;
                                     background:#7c3aed;
                                     color:#ffffff;
                                     text-decoration:none;
                                     padding:14px 30px;
                                     border-radius:8px;
                                     font-weight:bold;">
                                      Login to Your Account
                                  </a>
                              </div>

                              <p style="color:#666666; font-size:14px;">
                                  If you didn't create this account, please ignore this email or contact support immediately.
                              </p>

                          </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                          <td align="center" style="background:#f3f0ff; padding:20px; color:#666666; font-size:13px;">
                              © ${new Date().getFullYear()} Your Company. All rights reserved.
                          </td>
                      </tr>

                  </table>

              </td>
          </tr>
      </table>

  </body>
  </html>
  `;

  return html;
};