import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import {useSearchParams} from 'react-router-dom'
import '../style.scss';
import Image from "../share.jpg"


const SearchDatasets = ({newNotification}) => {
    let [datasets, setDatasets] = useState([]);
    const [searchParams] = useSearchParams();
    const datasetName = searchParams.get('search');


    useEffect(() => {
        if (datasetName !== null) {
            fetch(`http://127.0.0.1:8000/db/mydataset?search=${datasetName}`)
                .then(response => response.json())
                .then(data => {
                    setDatasets(data)
                })
                .catch(error => {
                    if (error.message)
                        newNotification(error.message, false);
                    console.log("algo correu mal" + error.message)
                })
        } else {
            fetch("http://127.0.0.1:8000/api/mydataset/")
                .then(response => response.json())
                .then(data => {
                    setDatasets(data)
                })
                .catch(error => {
                    if (error.message)
                        newNotification(error.message, false);
                    console.log("algo correu mal" + error.message)
                })

        }
    }, [datasetName]);
    return (
        <div>
            <h2 className={"center-content"}>

                Datasets Results
            </h2>
            {datasets.length > 0 &&
            <DatasetTable datasets={datasets}/>
            }
            {datasets.length === 0 &&
            <h2 className={"center-content"}>Datasets Not Found</h2>
            }
        </div>
    )
};

const DatasetTable = ({datasets}) => {
    let navigate = useNavigate();
    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <table className={"table table-bordered"}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Dataset Name</th>
                            <th>Dataset Description</th>
                            <th>Records Number</th>
                            <th>Action</th>

                        </tr>
                        </thead>
                        <tbody>
                        {datasets.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.record.length}</td>
                                    <td>
                                        <button type="button" className="btn btn-outline-info" onClick={() => {
                                            navigate(`/datasets/${item.id}/records`)
                                        }}><i className="bi bi-eye"></i>
                                        </button>
                                    </td>

                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const DatasetRecordsTable = ({currentItems, handleChange, newNotification}) => {

    const navigate = useNavigate();
    let {datasetId} = useParams();

    function handleDelete(itemId) {
        const deleteRecord = async () => {
            await axios.delete(
                `http://127.0.0.1:8000/db/mydataset/${datasetId}/deleterecord/${itemId}`
            ).then((response) => {
                if (response.data)
                    if (response.data.message)
                        newNotification(response.data.message, true)
            }).catch((error) => {
                    if (error.message)
                        newNotification(error.message, false)
                }
            )
        };
        deleteRecord().then(() => handleChange(undefined));
    }

    return (<>
            {currentItems.length === 0 &&
            <h3 className={"center-content"}> Dataset without records</h3>

            }
            {currentItems.length > 0 &&

            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <table className={"table table-bordered"}>
                            <thead>
                            <tr>
                                <th>date</th>
                                <th>time</th>
                                <th>precip</th>
                                <th>temp</th>
                                <th>rh</th>
                                <th>press</th>
                                <th>wspd</th>
                                <th>wdir</th>
                                <th>gamma</th>
                                <th>radon</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.date}</td>
                                        <td>{item.time}</td>
                                        <td>{item.precip}</td>
                                        <td>{item.temp}</td>
                                        <td>{item.rh}</td>
                                        <td>{item.press}</td>
                                        <td>{item.wspd}</td>
                                        <td>{item.wdir}</td>
                                        <td>{item.gamma}</td>
                                        <td>{item.radon}</td>
                                        <td>
                                            <button className={"btn btn-outline-success mr-4"}
                                                    onClick={() => navigate(`/datasets/${datasetId}/records/${item.id}/edit`)}>Edit
                                            </button>
                                            <button className={"btn btn-outline-danger"}
                                                    onClick={() => handleDelete(item.id)}>Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            }

        </>
    );
};

const PaginatedRecords = ({itemsPerPage, newNotification}) => {

    let {datasetId} = useParams();
    const navigate = useNavigate();
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);


    const [records, setRecords] = useState([]);
    const [isLoaded, setIsLoaded] = useState(undefined);


    let [name, setName] = useState(undefined);
    let [description, setDescription] = useState(undefined);

    let [onchangeData, setOnChangeData] = useState(undefined);

    const fetchData = async () => {
        try {
            const mydataset = await axios(
                `http://127.0.0.1:8000/api/mydataset/${datasetId}`
            );
            let myRecords = [];
            for (const seaproperty of mydataset.data.record) {
                const seapropertyId = seaproperty.split('seaproperties/')[1];
                const seapropertyrecord = await axios(
                    `http://127.0.0.1:8000/api/seaproperties/${seapropertyId}`
                );
                myRecords.push(seapropertyrecord.data)
            }
            setName(mydataset.data.name);
            setDescription(mydataset.data.description);

            setRecords(myRecords);
            setOnChangeData(true);
        } catch (e) {
            newNotification(e.message, false)
        }
    };

    function handleDeleteDataset() {
        const deleteDataset = async () => {
            await axios.delete(
                `http://127.0.0.1:8000/api/mydataset/${datasetId}`)
                .then((response) => {
                    if (response.status === 204)
                        newNotification("Dataset deleted successfully", true);

                }).catch(error => {
                    if (error.message)
                        newNotification(error.message, false);
                    console.log("algo correu mal" + error.message)
                })
        };
        deleteDataset().then(() => navigate(`/datasets`));
    }


    function handleChange(newValue) {
        setOnChangeData(newValue);
    }

    useEffect(() => {
        if (onchangeData === undefined) {
            fetchData().then(() => {
            });
        }
        if (onchangeData === true) {
            const endOffset = itemOffset + itemsPerPage;
            const currentItems = records.slice(itemOffset, endOffset);
            setCurrentItems(currentItems);
            setPageCount(Math.ceil(records.length / itemsPerPage));
            setIsLoaded(true);
            setOnChangeData(false);
        }

    }, [itemOffset, itemsPerPage, onchangeData]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % records.length;
        setItemOffset(newOffset);
        setOnChangeData(true);
        setIsLoaded(false);
    };

    return (
        <>
            <h2 className={"center-content"}>
                Dataset
            </h2>
            <h3 className={"center-content"}>
                Name: {name}
            </h3>
            <h3 className={"center-content"}>
                Description: {description}
            </h3>


            {isLoaded === true &&
            <DatasetRecordsTable currentItems={currentItems} handleChange={handleChange}
                                 newNotification={newNotification}/>
            }
            <ReactPaginate
                breakLabel="..."
                nextLabel=">>"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<<"
                renderOnZeroPageCount={null}
            />
            <div className={"center-content mt-4 mb-4"}>
                <button className={"btn btn-outline-success mr-4"}
                        onClick={() => navigate(`/datasets/${datasetId}/records/add`)}>Add Record
                </button>
                <button className={"btn btn-outline-danger"} onClick={() => handleDeleteDataset()}>Delete Dataset
                </button>
            </div>
        </>
    );
};

const AddFile = ({newNotification}) => {

    const [selectedFile, setSelectedFile] = useState("");
    const [reload, setReload] = useState(true);

    const [datasetProperties, setDatasetProperties] = useState({"name": "", "description": "", "checked": true});
    const navigate = useNavigate();

    function handleChangechecked(e) {
        setReload(false);
        setDatasetProperties({
            ...datasetProperties,
            [e.target.name]: !e.target.value || ''
        });
        setReload(true);
    }

    function handleChange(e) {
        setDatasetProperties({
            ...datasetProperties,
            [e.target.name]: e.target.value || ''
        });
    }


    function onFileChange(event) {
        setSelectedFile(event.target.files[0]);
    }

    function onFileUpload(e) {
        e.preventDefault();
        setReload(false);

        const formData = new FormData();
        formData.append(
            "document",
            selectedFile,
            selectedFile.name
        );
        formData.append('datasetProperties', JSON.stringify(datasetProperties));
        axios.post("http://127.0.0.1:8000/db/uploadfile", formData)
            .then(data => {
                console.log(data.data.message);
                newNotification(data.data.message, true);
                navigate(`/datasets`)
            })
            .catch(error => {
                console.log(error);
                if (error.response) {
                    setDatasetProperties({"name": "", "description": ""});
                    setSelectedFile(null);
                    setReload(true);
                    newNotification(error.response.data.message, false);
                    console.log(error.response.data.message)
                }
            })
    }


    return (
        <div>
            <h2 className={"center-content"}>
                Add New Dataset
            </h2>
            <form onSubmit={onFileUpload}>
                <div className="form-group col-md-5 col-sm-5">
                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="name">Dataset Name</label>
                        <input type="text" name="name" value={datasetProperties["name"]}
                               onChange={handleChange} required={true} minLength={2}
                               className="form-control"
                               id="name"
                        />
                    </div>
                    <div className="form-group col-md-6 col-xs-6">
                        <label htmlFor="description">Dataset Description</label>
                        <input name="description"
                               type="text"
                               value={datasetProperties["description"]}
                               onChange={handleChange} required={true} minLength={5}
                               className="form-control"
                               id="description"
                        />
                    </div>

                    {selectedFile &&
                    <div>
                        <div className="form-group col-md-6 col-xs-6">
                            <label htmlFor="filename">File Name</label>
                            <input
                                value={selectedFile.name}
                                disabled={true}
                                className="form-control"
                                id="filename"
                            />
                        </div>
                        <div className="form-group col-md-6 col-xs-6">
                            <label htmlFor="filetype">File Type</label>
                            <input
                                value={selectedFile.type}
                                disabled={true}
                                className="form-control"
                                id="filetype"
                            />
                        </div>

                        <div className="form-group col-md-6 col-xs-6">
                            <label htmlFor="lastModified">Last Modified</label>
                            <input
                                value={selectedFile.lastModifiedDate.toDateString()}
                                disabled={true}
                                className="form-control"
                                id="lastModified"
                            />
                        </div>
                    </div>}
                    {reload === true &&

                    <div className="form-check mb-2">
                        <input type="checkbox" name="checked"
                               checked={datasetProperties["checked"]}
                               value={datasetProperties["checked"]}
                               onChange={handleChangechecked}
                               className="form-check-input ml-0"
                               id="firstline"/>
                        <label htmlFor="firstline" className="form-check-label ml-3">The First Line is the
                            Header </label>
                    </div>}

                    {reload === true &&
                    <div className="form-group col-md-6 col-xs-6">
                        <input type="file" required={true} onChange={onFileChange}
                               id="inputGroupFile02"/>

                    </div>}
                    {
                        !selectedFile &&
                        <div className="ml-3">
                            <br/>
                            <p>Choose before Pressing the Upload button</p>
                        </div>
                    }
                    <button className="btn btn-primary ml-3">Upload!</button>
                </div>

            </form>

        </div>
    );
};

function HomePage() {
    return (
        <div className={"mt-4"}>
            <h3 className={"center-content mb-3"}>
                Collaborative Research Data Deposit Platform
            </h3>
            <div align="center">
                <img src={Image} alt="Italian Trulli" className={"center-content"}/>
            </div>
        </div>
    );
}

export {DatasetRecordsTable, PaginatedRecords, AddFile, HomePage, SearchDatasets};
