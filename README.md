I am Gunasekhar Velugubantla with Cwid: A20529275
EmailId: gvelugubantla@hawk.iit.edu

this is Lab 1 from course ITMD 542 Full-stack Development

GIT repo: https://github.com/Gunasekhar16/Full-Stack-Wed-Development-Lab-2.git

Project Description:
 This is about performing CRUD operations on a contact database. Have to perform viewing contact data, add data, edit and delete data.

Development Environment: 
 I used Visual Studio Code as my editor. I use Windows 11. node version: V20.9.0 with an npm version 10.2.3



 Install npm packages by running the following command in your project directory:
   ```bash
   npm install
   ```

## Usage

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
   with the JSON body like the following:
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
   Replace `contact-id` with the UUID of the contact you want to update, and include the updated information in the request body:
   ```json
   {
       "firstName": "Jane",
       "lastName": "Doe",
       "email": "jane.doe@example.com",
       "notes": "Updated note about this contact."
   }
   ```

