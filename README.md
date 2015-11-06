# slackinviter

Simple browser based tool for mass inviting users to private channels in slack. 

## Usage

Open the index.html in a browser. Add your slack API key, the channel name and a list of email addresses, then click Add.
The tool will invite all users on the email list that match a user in your Slack team to the channel. It will keep retrying failed
invitations every 15 minutes so the tool can be left running in a browser tab and users registering to the 
Slack team will get invites when they appear as users.

More users can be added to invitee list by adding them in the text field and clicking Add again.
