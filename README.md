# iam

## Indications
Instance MySQL locale utilisée

## Réponses aux questions

### Database and user model

**Question 1:**
We reset the database for each test case to be 100% sure another test will not impact our current test.\
For exemple we could have a test inserting one element with a name and another one adding another element with the same name and then fetching it.\
If we do not delete everything for each test, our second test could select the first element while he was expecting the second one.

**Question 2:**
Right now we have a SQL error because we are trying to add a user without email while it is required and we are not doing any validation before trying to add it.\

We should add a validation before submitting our element to the ORM. By validating before, we do not send anything to the database and we can return an error to the user.\
By doing so, the back end treatments are faster and controlled.

**Question 3:**
Having multiple security layers is never a bad idea. We could imagine multiple function able to edit the database, if we applied the validation in one of these functions 
and forgot the validation in another one. We can be pretty sure that the database won't insert/edit the element because of the constraints.
Moreover, with a validation we customize the error to return while a SQLError could display sensitive informations.

**Question 4:**
By having model validation we can ensure that the data imported in the database has a correct format considering the model we described.
By doing so, we won't have any surprise by using the data after the persistence.
For us, model validation is of course a real time protection, but it is even more important for the time coming after because as a developper we can trust the information 
inside the database.

For example, if we have two different user persisted with the same email address, we expose a user to information leak, unauthorized access to some part of the application, 
or in some cases server errors.

-----

I see two options for the database mechanism. 
The first one is to use database transactions, in case of error for one of the persisted entities, we could rollback and cancel any previous persistence of the transaction.
The other one could be the trigger on certain type of events such as ValidationFailure.

### Http endpoints

**Question 1:** REST naming convention regroup best practices for naming RESTful APIs. For example, the use of clear and unabridged names in order to simplify the code comprehension for the code reviewer. For endpoint naming, using nouns (separated with hyphens when it contains multiple word) is Rest naming naming best practice, the use of slashes is the meaning of URI hierarchy.

**Question 2:** POST /web-api/users is for user creation and POST /web-api/sessions is for session creation

**Question 4:**
If no schemas is provided for any of body, query and params, fastify doesn't throw anything. Body is an unknow type, such as query and params. 
If the client submits an unknown property, according to the JSON schema then fastify doesn't do anything one more time.
if the client omits a required property, according to the JSON schema then fastify automatically returns an error 400 without going through the route itself.

**Question 5:**
|                                                       |  Stateful Session |  	Stateless Session (JWT) |   
|-------------------------------------------------------|-------------------|---------------------------|
|  Scalability                                          | 	High            |   High                    |   
| Architecture Complexity                               | 	High            | Low                       |   
| Type and Quantity of Information Known by the Client  | 	High (session identifier)           | Low (encoded data)                    |   
|Revocation Strategy | Easy (can be removed from backen service) | Difficult (Can be revoked by backend service, but requires additional implementation ) |   
| Impact if a Session Leaks  | Severe  |  Limited |   
| Common Weaknesses Due to Misconfigurations  | data leakage, improper session management  | weak secret key, insecure storage  |  
| Client-side Strategy to Protect and Submit Token  | storing it in a cookie with a secure flag  | Send it in the headers with each request  |   
| Additional Library Requirements  | Backend-specific session management libraries  | Libraries for JWT signing and verification  |  

**Question 6:**
Solutions to protect the confidentiality of the session identifier stored in a browser’s cookie:

* Instead of storing the session data in the browser's cookie, storing it on the server will prevent the session data from being stolen if the cookie is intercepted. Same for the encryption, encrypt the session identifier on the server before storing it in the cookie.
* Setting a session timeout to limit the duration of a session. 
* Using secure cookies by setting the "Secure" flag on the cookie for example, This will prevent the cookie from being intercepted if the connection is insecure.
* Using HTTP-Only cookies by setting the "HttpOnly" flag on the cookie, in order prevent potential XSS attacks from stealing the cookie.
* Using Content Security Policy (CSP) allow you to  specify what sources of content are allowed to execute in a page, this will prevent any malicious code from executing on your website that could steal the session identifier.



