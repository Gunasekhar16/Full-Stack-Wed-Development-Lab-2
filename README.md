

 Install npm packages by running the following command in your project directory:
   ```bash
   npm install
   ```

## Usage

  use postman for better results.

 Run the project using the following command:
   ```bash
   node start
   ```

 To view all the contacts, send a GET request to:
   ```
   http://localhost:3000/contacts
   ```

 To create and add a new contact, send a POST request to:
   ```
   http://localhost:3000/contacts
   ```
   with the JSON body like following:
   ```json
   {
       "firstName": "Umair",
       "lastName": "Tariq",
       "email": "aliumer1080@gmail.com",
       "notes": "Met at a networking event. Interested in web development projects."
   }
   ```

 To delete a contact, send a DELETE request to:
   ```
   http://localhost:3000/contacts/contact-uuid
   ```
   Replace `contact-uuid` with the UUID of the contact you want to delete.

 To update a contact, send a PUT request to:
   ```
   http://localhost:3000/contacts/contact-uuid
   ```
   Replace `contact-uuid` with the UUID of the contact you want to update, and include the updated information in the request body:
   ```json
   {
       "firstName": "Jane",
       "lastName": "Doe",
       "email": "jane.doe@example.com",
       "notes": "Updated note about this contact."
   }
   ```

