import { Build, Component, State, h } from '@stencil/core'
import { handleResponse, getQueryParams } from '../../services/utils'
import {
  has as loHas,
  orderBy as loOrderBy
} from 'lodash-es'

interface Url {
  code: string,
  id: string,
  state: string,
}

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
})
export class AppHome {
  private YNAB_CLIENT_ID: string = 'f266d8d417503401bb5d1a3048d125e0fb3aaadc854e7b7eb0ebff672263637b'
  private YNAB_REDIRECT_URI: string = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://applecardforynab.com'
  private baseUrl: string = process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : 'https://applecardforynab.tyler.workers.dev'
  private url: Url

  @State() accountId: string
  @State() accounts: Array<any> = []
  @State() complete: boolean = false
  @State() error: boolean = false

  async componentWillLoad() {
    this.url = getQueryParams(location.search)

    if (loHas(this.url, 'code')) {
      this.url.id = this.url.state.split(':')[1]

      await fetch(`${this.baseUrl}/access`, {
        method: 'POST',
        body: JSON.stringify(this.url),
      })
      .then(handleResponse)
      .then((data) => {
        const accounts = loOrderBy(data, 'name', 'asc')
        this.accounts = accounts
        this.accountId = accounts[0].id
      })
      .catch(() => this.error = true)
    }

    else if (loHas(this.url, 'id'))
      this.url = {...this.url, state: `${Date.now()}:${this.url.id}`}

    history.replaceState(null, null, window.location.pathname)
  }

  update(e) {
    this.accountId = e.target.value
  }
  refresh() {
    fetch(`${this.baseUrl}/refresh`, {
      method: 'POST',
      body: JSON.stringify(this.url),
    })
    .then(handleResponse)
    .then((data) => {
      const accounts = loOrderBy(data, 'name', 'asc')
      this.accounts = accounts
      this.accountId = accounts[0].id
    })
    .catch(() => this.error = true)
  }
  save() {
    fetch(`${this.baseUrl}/update`, {
      method: 'POST',
      body: JSON.stringify({
        id: this.url.id,
        account_id: this.accountId
      }),
    })
    .then(() => this.complete = true)
    .catch(() => this.error = true)
  }

  render() {
    return (
      Build.isBrowser
      ? this.url
        ? (
            this.url.state
            && !this.url.code
            ? <div class="welcome">
                <h1>Apple Card for YNAB</h1>
                <a href={`https://app.youneedabudget.com/oauth/authorize?client_id=${this.YNAB_CLIENT_ID}&redirect_uri=${this.YNAB_REDIRECT_URI}&response_type=code&state=${this.url.state}`}>Connect your YNAB account</a>
                <a href="https://applecardforynab.com/assets/docs/privacy.md">Privacy policy</a>
              </div>

            : [
              <h1>Connected</h1>,
              this.error
              ? <p>❌</p>
              : this.complete
              ? <p>✅</p>
              : [
                <p>Select the YNAB account Apple Card transactions should be imported to.</p>,
                this.accounts.length
                ? <div class="actions">
                    <select onInput={(e) => this.update(e)}>
                      {this.accounts.map((account) =>
                        <option
                          value={account.id}
                          selected={this.accountId === account.id}
                        >{account.name}</option>
                      )}
                    </select>
                    <button onClick={() => this.refresh()}>Refresh</button>
                    <button onClick={() => this.save()}>Save</button>
                  </div>
                : null,
                <aside>If you don't have one yet <a href="https://app.youneedabudget.com" target="_blank">go make one</a> then come back and click refresh.</aside>,
              ]
            ]
          )
        : <div class="welcome">
            <h1>Apple Card for YNAB</h1>
            <p>Manual Apple Card imports gotcha down? This service automates the process making it as simple as possible to get those Apple Card transactions synced over to YNAB.</p>

            <ul>
              <li><strong>Step 1.</strong> Email Apple Card monthly statements as CSV attachments to <a href="mailto:parse@applecardforynab.com">parse@applecardforynab.com</a>.</li>
              <li><strong>Step 2.</strong> Relax.</li>
            </ul>

            <video controls width={750 / 2}>
              <source src="https://applecardforynab.com/assets/applecardforynab.mp4"/>
              Sorry, your browser doesn't support embedded videos.
            </video>

            <a href="https://applecardforynab.com/assets/docs/privacy.md">Privacy policy</a>
          </div>
      : null
    )
  }
}
