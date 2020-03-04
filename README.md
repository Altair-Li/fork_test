# Phonogenesis: Academic Quiz Platform for Phonology Questions #

### Note ###
If you encounter "There might be a problem with the project dependency tree. It is likely not a bug in Create React App, but something you need to fix locally." when running npm start from the terminal, add a .env file with the line "SKIP_PREFLIGHT_CHECK=true" (without parenthesis).

## OVERALL PURPOSE ##
The web application is an online quiz system designed for students or any visitor to
practice phonology problem sets, as well as for professors to generate questions and track
students’ progresses.

For students, they can generate simple quizzes for their self-studies, check their answers,
and track their quiz history in detail. They can also enrol to online quizzes that were generated by
a professor and get their automatically graded results.

For professors, they can generate and download files containing problem sets designated
for printing. They also have access to high-level rule generators involving more features
than students and organize an online quiz for students to solve in each deadline. Each professor
can form their own group for students to enrol, track each student’s progress, and give online
comments to students.

## FEATURE SPEC REQUIREMENTS ##
* User Profiling: Each student and professor have their own accounts with account name,
emails and avatars (student account and professor account). Professors create class
groups, and students can enrol to their corresponding groups. This information will be
part of account information and will be public to everyone in the same group. Students
will also have their own quiz and practice history, which will be visible to the professor
in his/her group.
* User Authentication and Authorization: Each student and professor have their own
account (account name + password) for login. There are also admin accounts. Visitors
without and account will only have access to a public page containing random problems.
Once a user is logged in, he/she will be redirected to their corresponding main page
(professor page, student page or admin page). Students have access to the simple rule
generator for casual practices, as well as any quiz generated by their professor. Professors
have access to quiz generation page and a more sophisticated problem generator with
more parameters, and the group they created with a list of all enrolled students and their
profiles.
* Data: Problem sets are the data for this project. The problem sets are generated through a
python script. The data generated by the python script depends on user selected
parameters and is randomized. The bottom-level datasets are IPA charts (static CSV files)
containing phonological data, which is parsed by the python script into phonology
problem sets, then adapted by front-end to be presented to the users.
* Views: For admins, there is a page to modify all existing accounts and a page to add new
users. Professors will have a page for generating problem sets and parsing them into
printed handout format, and a quiz generation page. There will also be a page for
organizing groups (invite/remove students) owned by the professor and checking their
students’ progresses. Students have a page for a simple rule generator for selfpractice,
a page for taking pending quizzes, and a page to check his/her own progress and
activity history.
* Admin: Admins have access to all users’ account information, and may change their
password, emails, account name, or remove the user permanently. They can also add new
users to a group.

## USER INTERACTIONS ##

### Students: ###
1. Self-practice using simple rule generator
2. Take Quizzes
3. Track own activity and quiz history

### Professor: ###
1. Generate problem sets using more sophisticated rule generator and export file
in printed handout format
2. Composing questions into a quiz for enrolled students
3. Track enrolled students’ activity histories
4. Manage the group (add/remove students)

Communication with python script (external data) is needed whenever a request to generate a
problem occurs. The server sends generation specifications to the python scripts, and the scripts
return the unformatted generation result to the server to be parsed and presented to users.
