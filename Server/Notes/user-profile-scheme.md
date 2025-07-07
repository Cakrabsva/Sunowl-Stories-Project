1. Users:
    - ID (Integer, Primary key)
    - username (String, unique, not null, lowercase)
    - password (String, not null, min len 8, contain min 1 Uppercase)
    - email (String, not null, email-format)
    - is_admin (Boolean = false)
    - is_active (Boolean = false)
    - is_verified: (Boolean = false)
    - username_changeAt(Date, allow null)
    - update_token (Integer = 5)
    - createdAt (date)
    - updatedAt (date) 

2. Profiles:
    - ID (Integer, Primary key)
    - first_name (String, max len 20)
    - last_name (String, max len 20)
    - bio (Text)
    - gender (string)
    - born_date (date)
    - avatar (string, url-format)
    - UserId (Foreign key)
    - createdAt (date)
    - updatedAt (date)

3. Users-Profiles Realation is ONE TO ONE

4. UX flow:
    - When Users are created, also Profiles.
    - After registering the form, users have to verify their email by    clicking the link sent by emails.
    - users can change their username from UI after 30 days creating the account and every 30 days after username_updatedAt.
    - users can change their password using a particular link that is sent   to their email.
    - users can have ‘forgot pass’ feature, and new pass configuration will  be sent to their email.
    - users can change their email anytime and the link will be sent to  their current email.
    - users cannot update more than 5 times in a month. *cumulative.
    - users cannot delete their Users nor Profiles.
