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
