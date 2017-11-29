# Decisions
- We will add the "messaging_type" param in May when Facebok make it a breaking change. We will notify impending change in docs. We will also add the Viber Service Messages tag at this point.
- MT Media Support: image, audio, video and file when the developer supplies a URL.
- MO Media Support: image, audio, video, file and location with a URL provided by Facebook Messenger. This URL lasts 24-48 hours and we advise the developer to download the content on delivery (save it media serivce as a product feature?)

## What We are not doing (yet)
- We are not handle payment events yet.
- We will not handle sender actions yet, typing indicator etc https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions
- We will not handle templates yet, https://developers.facebook.com/docs/messenger-platform/send-messages/templates
- We will tackle events send from Referral Params at a later date, based on customer feedback. https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_referrals
- We will not handle block and unblock from system level at a later date https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_referrals.
- We will not handle quick replies, getting started and persistent menus and their associated callbacks https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_postbacks. 


# To Do
- [ ] the use of "name" in the "to" param
- [ ] Investigate if we should handle Check in Plugin events (note this is different from referral param events)
- [ ] if we add "direction": "inbound" in our GET for the MT should we also display "direction": "outbound"
- [ ] How to handle subscribe and unsubscribe events from Viber Service Messages
