import axios from "axios";
import * as qs from 'qs';

export default class Account {
  name: string;
  username: string;
  password: string;

  constructor(username: string, password: string, name?: string) {
    this.name = name || username;
    this.username = username;
    this.password = password;
  }
}