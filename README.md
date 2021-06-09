# spaghetti-code 🍝

- **Idea**: Private-sessioned code battles (with Video/Audio chat)
  - First player writes the code, second player guesses the output
  - Both players attempt to solve the challenge as quick as possible
  - Both players attempt to solve the challenge in smallest code size

---

- **Conflict Plan**
  - In the case of conflict, the group will resort to voting.

- **What is your plan if you start to fall behind?**
  - We'll start with the easiest features, and add more features as time allows. 

- **Communication Protocol**
  - Verbalize your idea in the **Slack** channel before adding it in your branch, and check everyone's opinion on it
  - This allows all members to be updated on all currently worked-on features

- **Git Process**
  - Each member will work on their branch
  - Merging works best in a group session meeting
  - Make a branch called `dev`, which will act as a temporary `main`
  - All merging should happen to `dev`, which only merges to `main` when something is viable and tested

- **How often will you merge?**
  - Try as much as we can to merge every night 

- **How will you communicate that it’s time to merge?**
  - Through metaphysical telepathy  


---

File structure
![file structure](./assets/fs.jpg)

---

MongoDB schemas
![schemas](./assets/schemas.jpg)

---
### Challenge Route

| Method | Endpoint | Description  |
| :---: | :--- | :--- |
| GET | /challenge | Gets all challenges in the DB. |
| GET | /challenge/:id | Gets one challenge from the DB by ID. |
| POST | /challenge | adds one challenge to the DB. |
| PUT | /challenge/:id| Edits one challenge from the DB. |
| DELET | /challenge/:id| Deletes one challenge from the DB. |

---

### User Route

| Method | Endpoint | Description  |
| :---: | :--- | :--- |
| GET | /User | Gets all Users in the DB. |
| GET | /User/:id | Gets one User from the DB by ID. |
| POST | /User | adds one User to the DB. |
| PUT | /User/:id| Edits one User from the DB. |
| DELET | /User/:id| Deletes one User from the DB. |

---

### Random Challenge Route

| Method | Endpoint | Description  |
| :---: | :--- | :--- |
| GET | /getrandom | Gets one challenge from the DB randomly. |

---

### User Route

| Method | Endpoint | Description  |
| :---: | :--- | :--- |
| GET | /leadreboard | Gets the top 10 users in the DB sorted by score. |

---


### Technology

![tech](./assets/tech.jpg)

---

## Deployed Link


https://spaghetti-code.herokuapp.com
