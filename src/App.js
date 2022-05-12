import './App.css';
import MainContainer from "./Modules/Main/containers/main.container";
import {ToastProvider} from 'react-toast-notifications';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

    return (
        <div className="App">
            <ToastProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={1500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />

                <MainContainer/>
            </ToastProvider>
        </div>
    );
}

export default App;
