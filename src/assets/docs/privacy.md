# Apple Card for YNAB Privacy Policy
This Privacy Policy describes how your personal information is collected, used, and shared when you use applecardforynab.com (the "Service").

## PERSONAL INFORMATION WE COLLECT
The Service is designed for complete privacy. We only communicate in response to emails you send us. Your email address is stored for a brief period between when you make your first request and when you finalize your account creation, typically less than 5 minutes. YNAB access tokens are encrypted in such a way that we can only read them in response to emails you send us.

The Service does not track, store or log any emails or attachments sent to it, they are merely passed on from a SendGrid webhook to an AWS lambda function for parsing. YNAB GET requests are only used to verify valid connection or list existing accounts and nothing is ever stored from those requests. POST requests are limited to transactions sent in response to emails containing valid Apple Card CSV attachments.

## HOW DO WE USE YOUR PERSONAL INFORMATION?
The Personal Information email we store for the brief time during account creation we use to encrypt all other Personal Information so it’s only accessible when you send us emails with Apple Card CSV attachments. Personal Information YNAB credentials are therefore inaccessible outside of emails sent directly from your email address.

## SHARING YOUR PERSONAL INFORMATION
We do not share your personal information. We cannot. It’s either non-existent except for a brief moment during account creation or inaccessible after account creation.

### GitHub Sponsors
We use GitHub Sponsors for processing payments and managing our donations. They securely store your credit card information, and we never see those details.

The Service is free to use and operates off a donation business model. If you choose to donate your payment, while appreciated, is not considered a contract for the Service and must be managed outside of the Service.

### YNAB (You Need A Budget)
We connect to YNAB via their API. We use the API to retrieve your budget and account names so that you can specify where to send data to.

Finally, we may also share whatever data we do have to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.

## CHANGES
We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.

## CONTACT US
For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at hi@tinyanvil.com.

## AUDIT THE CODE
https://github.com/TinyAnvil/applecardforynab-stencil
https://github.com/TinyAnvil/applecardforynab-serverless