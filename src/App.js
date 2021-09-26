import logo from "./dictionary.png";
import './App.css';
import Dictionary from "./Dictionary";

function App() {
  return (
    <div className="container">
      <header>
        <div className="App mt-3">
            <img src={logo} className="App-logo img-fluid" alt="logo" />
        </div>
      </header>
      <main>
        <Dictionary defaultKeyword="sun" />
      </main>
      <footer>
        This website is designed and coded by UX Web and Brand Designer <a href="https://www.linkedin.com/in/tiffanylmackay/" target="_blank" rel="noreferrer">Tiffany Mackay</a>, and is <a href="https://github.com/tiffanymackay/dictionary-app-project" target="_blank" rel="noreferrer">open-sourced</a>.
        <br />
      </footer>
    </div>
  );
}

export default App;
