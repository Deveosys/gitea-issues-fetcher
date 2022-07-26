import axios, { AxiosResponse } from 'axios';
import parseLinkHeader from 'parse-link-header';
import Store from 'electron-store';
import { dialog } from 'electron';
import * as csvwriter from 'csv-writer';

export interface Credentials {
  user: string;
  password: string;
  host: string;
  organization: string;
  repository: string;
}

export interface Issue {
  id: number;
  url: string;
  html_url: string;
  number: number;
  user: {
    id: number;
    login: string;
    full_name: string;
    email: string;
    avatar_url: string;
    language: string;
    is_admin: false;
    last_login: string;
    created: string;
    restricted: false;
    active: false;
    prohibit_login: false;
    location: string;
    website: string;
    description: string;
    visibility: string;
    followers_count: number;
    following_count: number;
    starred_repos_count: number;
    username: string;
  };
  original_author: string;
  original_author_id: number;
  title: string;
  body: string;
  ref: string;
  labels: [
    {
      id: number;
      name: string;
      color: string;
      description: string;
      url: string;
    }
  ];
  milestone: null;
  assignee: null;
  assignees: null;
  state: string;
  is_locked: false;
  comments: any[];
  created_at: string;
  updated_at: string;
  closed_at: null;
  due_date: null;
  pull_request: null;
  repository: {
    id: number;
    name: string;
    owner: string;
    full_name: string;
  };
}

export const getIssues = async (event: Electron.IpcMainEvent, arg: any) => {
  const issues: Issue[] = [];

  const store = new Store();
  const credentials = store.get('credentials') as Credentials;

  const fetchApi = (page: string = '1'): Promise<AxiosResponse<any, any>> => {
    return axios.get(
      `https://${credentials.user}:${credentials.password}@${credentials.host}/api/v1/repos/${credentials.organization}/${credentials.repository}/issues?limit=50&page=` +
        page,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  };

  try {
    let response = await fetchApi();
    issues.push(...response.data);
    let link = parseLinkHeader(response.headers.link);
    while (link?.next) {
      response = await fetchApi(link.next.page);
      issues.push(...response.data);
      link = parseLinkHeader(response.headers.link);
    }
  } catch (error) {
    console.error(error);
  }

  store.set('issues', issues);

  event.reply('get-issues', issues);
};

export const saveIssuesAsFile = () => {
  const store = new Store();
  const issues = store.get('issues') as Issue[];

  dialog
    .showSaveDialog({
      defaultPath: '*/issues.csv',
    })
    .then((result) => {
      if (result.filePath && result.filePath !== '') {
        var createCsvWriter = csvwriter.createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: result.filePath,
          header: [
            { id: 'id', title: 'ID' },
            { id: 'title', title: 'TITLE' },
            { id: 'html_url', title: 'URL' },
            { id: 'state', title: 'STATE' },
            { id: 'created_at', title: 'CREATE AT' },
            { id: 'updated_at', title: 'UPDATED AT' },
            { id: 'custom_comments', title: 'COMMENTS' },
          ],
        });
        issues.forEach((issue) => {
          if (issue.labels.length > 0) {
            const labels: string[] = [];
            issue.labels.forEach((label) => {
              labels.push(label.name);
            });
            issue.state = labels.join(' - ');
          }
          const created_at = new Date(issue.created_at);
          issue.created_at =
            created_at.getDate().toString().padStart(2, '0') +
            '/' +
            (created_at.getMonth() + 1) +
            '/' +
            created_at.getFullYear();
          const updated_at = new Date(issue.updated_at);
          issue.updated_at =
            updated_at.getDate().toString().padStart(2, '0') +
            '/' +
            (updated_at.getMonth() + 1) +
            '/' +
            updated_at.getFullYear();
        });

        csvWriter
          .writeRecords(issues)
          .then(() => console.log('Data uploaded into csv successfully'));
      }
    })
    .catch((err) => console.error(err));
};
