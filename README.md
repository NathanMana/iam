# iam

## Indications
Instance MySQL locale utilisée

## Réponses aux questions

### Question 1
We reset the database for each test case to be 100% sure another test will not impact our current test.\
For exemple we could have a test inserting one element with a name and another one adding another element with the same name and then fetching it.\
If we do not delete everything for each test, our second test could select the first element while he was expecting the second one.

### Question 2
Right now we have a SQL error because we are trying to add a user without email while it is required and we are not doing any validation before trying to add it.\

We should add a validation before submitting our element to the ORM. By validating before, we do not send anything to the database and we can return an error to the user.\
By doing so, the back end treatments are faster and controlled.

### Question 3
Having multiple security layers is never a bad idea. We could imagine multiple function able to edit the database, if we applied the validation in one of these functions 
and forgot the validation in another one. We can be pretty sure that the database won't insert/edit the element because of the constraints.
Moreover, with a validation we customize the error to return while a SQLError could display sensitive informations.