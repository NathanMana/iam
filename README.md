# iam

## Indications
Instance MySQL locale utilisée

## Réponses aux questions

### Question 1
We reset the database for each test case to be 100% sure another test will not impact our current test.
For exemple we could have a test inserting one element with a name and another one adding another element with the same name and then fetching it.
If we do not delete everything for each test, our second test could select the first element while he was expecting the second one.