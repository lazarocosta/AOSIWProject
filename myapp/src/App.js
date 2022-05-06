import './App.css';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {Route, Routes, useNavigate, useParams} from 'react-router-dom';
import {createBrowserHistory} from "history";
import moment from 'moment'
import {AddFile, PaginatedRecords, HomePage, SearchDatasets} from "./Components/Dataset";

const MyForm = ({handleChange, record, handleSubmitEdit, typeOfRecord}) => {
    return (
        <form onSubmit={handleSubmitEdit}>
            <div className="form-group col-md-6 col-sm-6">
                <div className="row">
                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="date">Date</label>
                        <input type="date" name="date" value={record.date} required={true} onChange={handleChange}
                               className="form-control"
                               id="date"
                        />
                    </div>
                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="date">Time</label>
                        <input type="time" name="time" value={record.time} required={true} onChange={handleChange}
                               className="form-control"
                               id="date"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="precip">Precipitation</label>
                        <input type="number" required={true} min="0" step="0.01" name="precip" value={record.precip}
                               onChange={handleChange}
                               className="form-control"
                               id="precip"
                        />
                    </div>

                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="temp">Temperature</label>
                        <input type="number" required={true} min="0" step="0.01" name="temp" value={record.temp}
                               onChange={handleChange}
                               className="form-control"
                               id="temp"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="rh">Relative Humidity</label>
                        <input type="number" required={true} min="0" step="0.01" name="rh" value={record.rh}
                               onChange={handleChange}
                               className="form-control"
                               id="rh"
                        />
                    </div>


                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="rh">Pressure</label>
                        <input type="number" required={true} min="0" step="0.01" name="press" value={record.press}
                               onChange={handleChange}
                               className="form-control"
                               id="rh"
                        />
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="wspd">Wind Speed</label>
                        <input type="number" required={true} min="0" step="0.01" name="wspd" value={record.wspd}
                               onChange={handleChange}
                               className="form-control"
                               id="wspd"
                        />
                    </div>

                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="wdir">Wind Direction</label>
                        <input type="number" required={true} min="0" step="0.01" name="wdir" value={record.wdir}
                               onChange={handleChange}
                               className="form-control"
                               id="wdir"
                        />
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="gamma">Gamma</label>
                        <input type="number" required={true} min="0" step="0.01" name="gamma" value={record.gamma}
                               onChange={handleChange}
                               className="form-control"
                               id="gamma"
                        />
                    </div>

                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="radon">Radon</label>
                        <input type="number" required={true} min="0" step="0.01" name="radon" value={record.radon}
                               onChange={handleChange}
                               className="form-control"
                               id="radon"
                        />
                    </div>
                </div>
                {typeOfRecord === true && <button type="submit" className="btn btn-outline-success">Update Record</button>}
                {typeOfRecord === false && <button type="submit" className="btn btn-outline-success">Add new Record</button>}
            </div>
        </form>
    );
};

const EditAndAddRecordToDataset = ({newNotification}) => {
    const navigate = useNavigate();
    const [record, setRecord] = useState({
        'date': moment().format('YYYY-MM-DD'),
        'time': "",
        'precip': "",
        'temp': "",
        'rh': "",
        'press': "",
        'wspd': "",
        'wdir': "",
        'gamma': "",
        'radon': ""

    });
    const [datasetName, setDatasetName] = useState("");
    const [editPage, setEditPage] = useState(undefined);
    let {datasetId, recordId} = useParams();


    useEffect(() => {
        const history = createBrowserHistory();
        fetch(`http://127.0.0.1:8000/api/mydataset/${datasetId}`)
            .then(response => response.json())
            .then(data => {
                setDatasetName(data.name);
            })
            .catch(error => {
                console.log(error);
                newNotification(error.message, false)
            });
        if (history.location.pathname.includes("edit") === true) {
            setEditPage(true);
            fetch(`http://127.0.0.1:8000/api/seaproperties/${recordId}`)
                .then(response => response.json())
                .then(data => {
                    setRecord(data);
                })
                .catch(error => {
                    console.log(error.message);
                    newNotification(error.message, false)
                })
        } else
            setEditPage(false);
    }, []);

    function handleChange(e) {
        setRecord({
            ...record,
            [e.target.name]: e.target.value || ''
        });
    }

    function handleSubmitEdit(event) {
        event.preventDefault();
        if (editPage === false) {
            fetch(`http://127.0.0.1:8000/db/mydataset/${datasetId}/addrecord`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(record)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message)
                        newNotification(data.message, true);
                    navigate(`/datasets/${datasetId}/records`)
                })
                .catch(error => {
                    newNotification(error.message, false);
                    console.log("algo correu mal" + error.message)
                })

        }

        if (editPage === true) {
            fetch(`http://127.0.0.1:8000/db/mydataset/${datasetId}/records/${recordId}/edit`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(record)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message)
                        newNotification(data.message, true)
                    navigate(`/datasets/${datasetId}/records`)
                })
                .catch(error => {

                    newNotification(error.message, false);
                    console.log("algo correu mal" + error.message)
                })

        }
    }

    return (
        <div>
            {editPage === true && <h2 className={"center-content"}>Edit Record From Dataset: {datasetName}</h2>}
            {editPage === false && <h2 className={"center-content"}>Add Record To Dataset: {datasetName}</h2>}
            <MyForm handleChange={handleChange} record={record} handleSubmitEdit={handleSubmitEdit} typeOfRecord={editPage}/>

                </div>
    );
};

function NavBar() {
    const [datasetToSearch, setDatasetToSearch] = useState("");
    const navigate = useNavigate();


    function onFileUpload(e) {
        e.preventDefault();
        navigate(`/datasets?search=${datasetToSearch}`);

    }

    function handleChange(e) {
        setDatasetToSearch(e.target.value || '');

    }


    return (
        <nav className="navbar navbar-expand-lg navbar-light  my-color">
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <a className="nav-item nav-link active" href="/">Home <span className="sr-only">(current)</span></a>
                    <a className="nav-item nav-link" href="/datasets">List Datasets</a>
                    <a className="nav-item nav-link" href="/datasets/add">Add Dataset</a>
                </div>
            </div>
            <form className="form-inline" onSubmit={onFileUpload}>
                <input className="form-control mr-sm-2" onChange={handleChange} type="search"
                       placeholder="Search"
                       aria-label="Search" value={datasetToSearch}/>
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
        </nav>
    );
}

function MyApp() {
    const [myMessages, setMyMessages] = useState([]);

    const [show, setShow] = useState(false);
    const delay = 3;
    const [index, setIndex] = useState(undefined);


    function newNotification(message, success) {
        let index = Math.random();

        let myMessage = {
            "message": message,
            'success': success,
            'index': index
        };

        setMyMessages([...myMessages, myMessage]);
        setShow(true);

        setTimeout(() => {
            setIndex(index);

            setShow(false)
        }, delay * 1000);
    }

    useEffect(
        () => {
            setShow(false);
            setMyMessages(myMessages.filter(function (message) {
                return message.index !== index
            }));
            setShow(true);
        }

        , [index]
    )
    ;

    return (
        <div>
            {show === true &&
            <div className={"sidebar col-md-2 col-sm-4"}>
                {myMessages.map((item, index) => {
                    return (
                        <div key={index}>{
                            item["success"] === true &&
                            <div className={"notibox success"}>{item['message']}
                            </div>
                        }{
                            item["success"] === false &&
                            <div className={"notibox error"}>{item['message']}
                            </div>
                        }
                        </div>
                    )
                })}
            </div>}


            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/datasets" element={<SearchDatasets newNotification={newNotification}/>}/>
                <Route path="/datasets/:datasetId/records"
                       element={<PaginatedRecords itemsPerPage={7} newNotification={newNotification}/>}/>
                <Route path="/datasets/add" element={<AddFile newNotification={newNotification}/>}/>
                <Route path="/datasets/:datasetId/records/:recordId/edit"
                       element={<EditAndAddRecordToDataset newNotification={newNotification}/>}/>
                <Route path="/datasets/:datasetId/records/add"
                       element={<EditAndAddRecordToDataset newNotification={newNotification}/>}/>
            </Routes>
            <div className={"mb-6"}></div>

            <footer className={"myFooter"}>
                <p className={"m-1"}>Author: Lázaro Costa</p>
                <p className={"m-1"}>Year 2022</p>
                <p><a href="mailto:lazaro@fe.up.pt">lazaro@fe.up.pt</a></p>
            </footer>

        </div>
    );
}

export {NavBar, EditAndAddRecordToDataset, MyApp};
