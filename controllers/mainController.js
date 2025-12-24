import { UserModel } from "../models/userModel.js";
import { UserView } from "../views/userView.js";

export class MainController {
  constructor() {
    this.model = new UserModel();
    this.view = new UserView();
  }

  init() {
    const users = this.model.getUsers();
    this.view.render(users);
  }
}
