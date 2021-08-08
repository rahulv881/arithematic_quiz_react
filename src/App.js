import logo from './logo.svg';
import './App.css';
import QuizScreen from './screens/quiz_screen/QuizScreen';
import { MuiThemeProvider } from 'material-ui/styles';

function App() {
  return (
    <div className="App">
      <MuiThemeProvider>
        <QuizScreen />
      </MuiThemeProvider>
    </div>
  );
}

export default App;
