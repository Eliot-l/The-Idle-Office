export class UserView {
  render(users) {
    const app = document.getElementById("app");

    app.innerHTML = `
      <ul>
        ${users.map(user => `<li>${user.name}</li>`).join("")}
      </ul>
    `;
  }
}
