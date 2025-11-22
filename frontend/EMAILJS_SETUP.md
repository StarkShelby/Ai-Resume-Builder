# EmailJS Setup Guide for Contact Form

## Quick Setup (5 minutes)

Follow these steps to get your contact form sending real emails to **skynight410@gmail.com**:

---

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up Free"**
3. Sign up with your Google account (skynight410@gmail.com) or email
4. Verify your email address

---

## Step 2: Add Email Service

1. Once logged in, go to **"Email Services"** in the left sidebar
2. Click **"Add New Service"**
3. Select **Gmail** (recommended)
4. Click **"Connect Account"**
5. Sign in with your Gmail (skynight410@gmail.com)
6. Allow EmailJS to send emails on your behalf
7. **Copy the Service ID** (looks like: `service_xxxxxxx`)

---

## Step 3: Create Email Template

1. Go to **"Email Templates"** in the left sidebar
2. Click **"Create New Template"**
3. Replace the default template with this:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}}
Email: {{from_email}}

Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
Reply to: {{from_email}}
```

4. **Important**: In the template settings:
   - **To Email**: Enter `skynight410@gmail.com`
   - **From Name**: `Portfolio Contact Form`
   - **Reply To**: `{{from_email}}`

5. Click **"Save"**
6. **Copy the Template ID** (looks like: `template_xxxxxxx`)

---

## Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"** in the left sidebar
2. Find the **"Public Key"** section
3. **Copy your Public Key** (looks like: `xxxxxxxxxxxxxx`)

---

## Step 5: Add Keys to Your Project

1. Open your `.env.local` file in the frontend folder
2. Add these three lines (replace with your actual keys):

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx
```

3. **Save the file**

---

## Step 6: Restart Your Dev Server

1. Stop your current dev server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. The contact form will now send real emails!

---

## Testing

1. Go to `http://localhost:3000/contact`
2. Fill out the form with test data
3. Click "Send Message"
4. Check your Gmail inbox (skynight410@gmail.com) - you should receive the message!

---

## Email Template Variables

The template uses these variables from your form:
- `{{from_name}}` - Name from the form
- `{{from_email}}` - Email from the form
- `{{subject}}` - Subject from the form
- `{{message}}` - Message from the form
- `{{to_email}}` - Your email (skynight410@gmail.com)

---

## Free Tier Limits

- ✅ **200 emails per month**
- ✅ **Unlimited templates**
- ✅ **Email delivery tracking**
- ✅ **Auto-reply feature** (optional)

---

## Troubleshooting

### "Failed to send message" error
- Check that all three environment variables are set correctly
- Make sure you restarted the dev server after adding .env.local
- Verify your EmailJS service is connected to Gmail

### Not receiving emails
- Check your Gmail spam folder
- Verify the "To Email" in the template is set to skynight410@gmail.com
- Check EmailJS dashboard for delivery status

### Rate limit exceeded
- Free tier allows 200 emails/month
- Upgrade to paid plan if needed (starts at $7/month for 1000 emails)

---

## Optional: Auto-Reply to Users

To send a confirmation email to people who contact you:

1. Create a second template in EmailJS
2. Set "To Email" to `{{from_email}}`
3. Write a nice confirmation message
4. In your code, add a second `emailjs.send()` call with the auto-reply template

---

## Security Note

✅ **Safe**: Your EmailJS keys are public keys (NEXT_PUBLIC_*) - they're meant to be exposed in the browser  
✅ **Protected**: EmailJS handles rate limiting and spam protection  
✅ **Secure**: Your Gmail password is never exposed - EmailJS uses OAuth

---

## Need Help?

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Dashboard: https://dashboard.emailjs.com/

---

**Once you complete these steps, your contact form will send real emails to skynight410@gmail.com!** 📧✨
