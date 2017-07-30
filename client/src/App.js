import React, { Component } from 'react';
import './App.css';

class App extends Component {
  // Initialize state
  constructor(props){
    super(props);
  this.state = { articles: [] }


  }
  // Fetch articles after first mount
  componentDidMount() {
    this.getArticles();
  }

  getArticles = () => {
    // Get the articles and store them in state
    fetch('/api/articles')
    .then(res => res.json())
      .then(articles => {

        this.setState({ articles: [...this.state.articles, ...articles] })
      });
  }

  render() {
    const articles = this.state.articles;
    return (
      <div className="App">
        {/* Render the articles if we have them */}
        {articles.length ? (
          <div>
            <h1>5 Articles.</h1>
            <ul className="articles">
              {/*
                Generally it's bad to use "index" as a key.
                It's ok for this example because there will always
                be the same number of articles, and they never
                change positions in the array.
              */}
              {articles.map((article, index) =>
                <li key={index}>
                  ID: {article._id}, Title: {article.title}, URL: {article.url}
                </li>
              )}
            </ul>
            <button
              className="more"
              onClick={this.getArticles}>
              Get More
            </button>
          </div>
        ) : (
          // Render a helpful message otherwise
          <div>
            <h1>No articles :(</h1>
            <button
              className="more"
              onClick={this.getArticles}>
              Try Again?
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
