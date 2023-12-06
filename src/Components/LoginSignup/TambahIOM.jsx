import React, { useState } from 'react'
import './LoginSignup.css'
import Table from 'react-bootstrap/Table';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useAsyncError, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Row, Col, Form, Modal, Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Select from 'react-select'
import { errorMessageFormInput, isErrorInputForm } from '../Error/ErrorHandle';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from 'axios';
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);



const TambahIOM = () => {
    //NAVIGASI HANDLER
    function btnHandle_backHome() {
        navigate('/Home');

    }
    function btnHandle_backDataIOM() {
        navigate('/DataIOM');

    }

    //DEFINISI VARIABEL
    const storedData = localStorage.getItem('dataUser');
    const userData = storedData ? JSON.parse(storedData) : null;
    const [readUserApproval, setReadUserApproval] = useState([]);
    const [selectedKlasifikasi, setSelectedKlasifikasi] = useState([]);
    const [selectedJenisIOM, setSelectedJenisIOM] = useState([]);
    const [selectedKategori, setSelectedKategori] = useState([]);

    const [approvalData, setApprovalData] = useState([]);
    const [typeIOM, setTypeIOM] = useState([]);
    const [kategoriIOM, setKategoriIOM] = useState([]);
    const [files, setFiles] = useState([]);

    const [currentDate, setCurrentDate] = useState('');
    const navigate = useNavigate();

    const [content, setContent] = useState('');

    // Menyimpan nilai input dari Form
    const [from, setDari] = useState([]);
    const [kepada, setKepada] = useState([]);
    const [cc, setCC] = useState([]);
    const [type, setType] = useState('');
    const [category, setKategori] = useState('');
    const [save_as, setSaveAs] = useState('DRAFT');
    const [urgensiIOM, setUrgensiIOM] = useState(false);
    const [invalidError, setInvalidError] = useState(null)
    const [inputError, setInputError] = useState([])



    const [inputs, setInputs] = useState({
        date: new Date(),
        important: false,
        aggrement: false,
        to_note: false,
        as_information: false,
        approval: '',
        approval_name:  '',
        type: '',
        category: '',
        about: '',
        attachment: '',
        content: '',
        save_as: 'DRAFT',
        is_urgent: false,
        code : '',
    })

    const onChangeInput = (e) => {
        const { name, value, type, checked } = e.target;
      
        // If the input is a checkbox, set the value as boolean
        const inputValue = type === 'checkbox' ? checked : value;
      
        setInputs((prevInputs) => ({
          ...prevInputs,
          [name]: inputValue,
        }));
    };
      
    const handleSubmit = async () => {
        const data ={
            date :  inputs.date,
            code : inputs.code,
            from : from,
            to : kepada,
            cc : cc,
            approval : approval,
            type : type.value, 
            category : category.value,
            about : inputs.about,
            attachment :  inputs.attachment,
            content : content,
            important :  inputs.important,
            aggrement :  inputs.aggrement,
            to_note : inputs.to_note,
            as_information : inputs.as_information,
            save_as :  save_as,
            is_urgent : urgensiIOM,
        }
        // console.log(data)

        try {
            const formData = new FormData();
      
            if (files && files.length > 0)
                for (let i = 0; i < files.length; i++)
                    formData.append('files', files[i])
            formData.append('date', inputs.date || new Date());
            formData.append('code', inputs.code);
            formData.append('approval', approval);
            formData.append('type', type.value);
            formData.append('category', category.value);
            formData.append('about', inputs.about);
            formData.append('attachment', inputs.attachment);
            formData.append('content', content);
            formData.append('important', inputs.important);
            formData.append('aggrement', inputs.aggrement); // Correct typo
            formData.append('to_note', inputs.to_note);
            formData.append('as_information', inputs.as_information);
            formData.append('save_as', save_as);
            formData.append('is_urgent', urgensiIOM);
            
            // Handle dari, kepada, cc, files array
            if (from && from.length > 0) {
                from.forEach((item, index) => {
                    formData.append(`from[${index}][user_id]`, item.user_id)
                    formData.append(`from[${index}][name]`, item.name)
                })
            }

            if (kepada && kepada.length > 0) {
                kepada.forEach((item, index) => {
                    formData.append(`to[${index}][user_id]`, item.user_id)
                    formData.append(`to[${index}][name]`, item.name)
                })
            }

            if (cc && cc.length > 0) {
                cc.forEach((item, index) => {
                    formData.append(`cc[${index}][user_id]`, item.user_id)
                    formData.append(`cc[${index}][name]`, item.name)
                })
            }
            
            const config = {
                headers: { 'Authorization': `Bearer ${userData.accessToken}`,
                            'Content-Type': 'multipart/form-data' },
            }
            const { data } = await axios.post('https://github.modernland.co.id/api/v1/iom', formData, config)
            if (data.meta.success) {
                console.log(data)
            }
        } 
        catch (error) {
            console.error('An error occurred', error);
            // Handle the error appropriately
            const code = error.response.data.meta.status;
            if (code === 422) {
                const msg_error =  error.response.data.result;
                setInputError(msg_error)
            }
            console.log(invalidError)
            // console.log("Complete the field")
        }
    }
    
    
    //FETCHING SEGMENT
    //Fetching Data For User Approval
    useEffect(() => {
        fetch(`https://github.modernland.co.id/api/v1/user/approval?limit=35`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userData.accessToken}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
            setReadUserApproval(data.result.map((user) => ({ value: user.id, label: user.name })));
            // console.log(data.result.map((user) => ({ value: user.id, label: user.name })))
            })
            .catch(error => {
            console.error('Error fetching data:', error);
            });
    }, []);
    
    useEffect(() => {
        fetch(`https://github.modernland.co.id/api/v1/master/approval/by-user`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${userData.accessToken}`,
            'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
            setApprovalData(data.result);
            })
            .catch(error => {
            console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        fetch(`https://github.modernland.co.id/api/v1/iom/type`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userData.accessToken}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.result && data.result.data) {
                    // Assuming data.result.data is an array
                    const typeIOMOptions = data.result.data.map(item => ({ value: item.name, label: item.name }));
                    setTypeIOM(typeIOMOptions);
                    // console.log('typeIOM:', typeIOMOptions);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        fetch(`https://github.modernland.co.id/api/v1/iom/category?limit=50`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userData.accessToken}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.result && data.result.data) {
                    // Assuming data.result.data is an array
                    const categoryIOM = data.result.data.map(item => ({ value: item.name, label: item.name }));
                    setKategoriIOM(categoryIOM);
                    // console.log('typeIOM:', typeIOMOptions);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    
    
    //FUNCTION PROGRAM
    useEffect(() => {
        // Panggil fungsi untuk mengatur tanggal saat komponen dimount
        setCurrentDate(getFormattedDate());
    }, []); // Tambahkan array kosong agar useEffect hanya dijalankan sekali saat komponen dimount

    useEffect(() => {
        // console.log('Selected Klasifikasi updated:', selectedKlasifikasi);
    }, [selectedKlasifikasi]);

    useEffect(() => {
        // console.log('Selected JenisIOM updated:', selectedJenisIOM);
    }, [selectedJenisIOM]);

    useEffect(() => {
    }, [selectedKategori]);
    
    useEffect(() => {
        // console.log('Simpan Sebagai:', saveAs);
    }, [save_as]);
    useEffect(() => {
        // console.log('Urgensi IOM:', urgensiIOM);
    }, [urgensiIOM]);

    // Fungsi untuk mendapatkan tanggal saat ini dalam format tertentu (misalnya: "YYYY-MM-DD")
    const getFormattedDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleAttachment = (fileItems) => {
        const files = fileItems.map((fileItem) => fileItem.file)
        setFiles(files)
    }
 

    // Fungsi untuk menangani perubahan input Dari
    const handleChange_Dari = (selectedOptions) => {
        const fromState = selectedOptions.map(user => ({
            user_id : user.value,
            name : user.label,
        }))
        console.log('from state: ', fromState)
        setDari(fromState);
    };
    // Fungsi untuk menangani perubahan input Kepada
    const handleChange_Kepada = (selectedOptions) => {
        const toState = selectedOptions.map(user => ({
            user_id : user.value,
            name : user.label,
        }))
        console.log('to state: ', toState)
        setKepada(toState); // Set nilai dari dropdown Dari ke state
    };
    // Fungsi untuk menangani perubahan input CC
    const handleChange_CC = (selectedOptions) => {
        const ccState = selectedOptions.map(user => ({
            user_id : user.value,
            name : user.label,
        }))
        console.log('cc state: ', ccState)
        setCC(ccState); // Set nilai dari dropdown Dari ke state
    };
    // Fungsi untuk menangani perubahan input typeIOM
    const handleChange_typeIOM = (selectedOptions) => {
        setType(selectedOptions);
    };
    // Fungsi untuk menangani perubahan input typeIOM
    const handleChange_Kategori = (selectedOptions) => {
        setKategori(selectedOptions);
    };

    const [showModal, setShowModal] = useState(false);
    const handleUserFieldClick = () => {
        setShowModal(true);
      };
    const [pilihanApproval, setPilihanApproval] = useState("");
    const [approval, setPilihanIDApproval] = useState("");

    const handlebtn_pilihanApproval = (value, id) => {
        setPilihanApproval(value)
        setPilihanIDApproval(id)
        setShowModal(false);
    }

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setContent(data);
        console.log('Data from CKEditor:', content)
    };


     
    return (
        <div className="container">
            <br />
            <div className="container-fluid">
                <Breadcrumb >
                    <Breadcrumb.Item onClick={btnHandle_backHome}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={btnHandle_backDataIOM}>
                        Data IOM
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Tambah IOM</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <h2 className='container-fluid'>Tambah</h2>

            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Tanggal
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Form.Control
                        disabled
                        type="text"
                        id="inputTanggal"
                        aria-describedby="passwordHelpBlock"
                        value={currentDate}
                    />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Nomor
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Form.Control
                        type="text"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        name='code'
                        onChange={onChangeInput}
                        className={
                            isErrorInputForm(
                                inputError,
                                'code',
                            ) && 'p-invalid'
                        }
                        style={{
                            borderColor: isErrorInputForm(inputError, 'code') ? 'red' : '',
                        }}
                    />
                    {isErrorInputForm(
                            inputError,
                            'code',
                        ) && (
                            <small style={{ color: 'red' }} className='p-error'>
                                {errorMessageFormInput(
                                    inputError,
                                    'code',
                                )}
                            </small>
                    )}
                    
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Dari
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <Select
                            isMulti
                            name="dari"
                            options={readUserApproval}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={from.name} // Set nilai dari dropdown Dari dari state
                            onChange={handleChange_Dari} // Set fungsi handleOnChange_Dari sebagai penangan perubahan input
                        />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Kepada
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Select
                        isMulti
                        name="colors"
                        options={readUserApproval}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleChange_Kepada}
                        value={kepada.label}
                    />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    CC
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Select
                        isMulti
                        name="colors"
                        options={readUserApproval}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleChange_CC}
                        value={cc.label}
                    />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Klasifikasi
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <div key={`inline-checkbox`} className="mb-4">
                            <Form.Check
                                inline
                                label="Penting"
                                value="Penting"
                                name="important"
                                type="checkbox"
                                id={`inline-checkbox-1`}
                                onChange={onChangeInput}
                            />
                            <Form.Check
                                inline
                                label="Persetujuan"
                                value="Persetujuan"
                                name="aggrement"
                                type="checkbox"
                                id={`inline-checkbox-2`}
                                onChange={onChangeInput}
                            />
                            <Form.Check
                                inline
                                label="Untuk Diperhatikan"
                                value="Untuk Diperhatikan"
                                name="to_note"
                                type="checkbox"
                                id={`inline-checkbox-3`}
                                onChange={onChangeInput}
                            />
                            <Form.Check
                                inline
                                label="Sebagai Informasi"
                                value="Sebagai Informasi"
                                name="as_information"
                                type="checkbox"
                                id={`inline-checkbox-4`}
                                onChange={onChangeInput}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    User Yang Menyetujui
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <Form.Control
                        type="text"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        onClick={handleUserFieldClick}
                        value={pilihanApproval}
                        className={
                            isErrorInputForm(
                                inputError,
                                'approval',
                            ) && 'p-invalid'
                        }
                        style={{
                            borderColor: isErrorInputForm(inputError, 'approval') ? 'red' : '',
                        }}
                        />
                        {isErrorInputForm(
                            inputError,
                            'approval',
                        ) && (
                            <small style={{ color: 'red' }} className='p-error'>
                                {errorMessageFormInput(
                                    inputError,
                                    'approval',
                                )}
                            </small>
                        )}
                    </div>
                </Col>
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>User Yang Menyetujui</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    <div className="grid-container">
                    {approvalData && approvalData.data && approvalData.data.map((item, index) => (
                        <Card key={index} className="mb-3">
                        <Card.Header><b>{item.name}</b></Card.Header>
                        <Card.Body >
                            {item.detail && item.detail.length > 0 ? (
                            <Table striped bordered hover variant="dark">
                                <thead>
                                <tr>
                                    <th>Nomor</th>
                                    <th>Approval</th>
                                    <th>Sebagai</th>
                                    <th>Paralel</th>
                                </tr>
                                </thead>
                                <tbody>
                                {item.detail.map((detailItem, detailIndex) => (
                                    <tr key={detailIndex}>
                                    <td>{detailIndex + 1}</td>
                                    <td>{detailItem.user_approve}</td>
                                    <td>{detailItem.as}</td>
                                    <td>{detailItem.is_paralel ? 'Ya' : 'Tidak'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            ) : (
                            <p>No detail data available</p>
                            )}
                            <Button style={{marginLeft: '180px'}} onClick={() => handlebtn_pilihanApproval(item.name, item.id)}>Pilih</Button>
                        </Card.Body>
                        </Card>
                    ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Tutup
                    </Button>
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                    Simpan
                    </Button>
                </Modal.Footer>
                </Modal>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Jenis
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <Select
                            name="colors"
                            options={typeIOM}
                            // className="basic-multi-select"
                            // className={
                            //     `w-full ${
                            //         isErrorInputForm(
                            //             inputError,
                            //             'type',
                            //         )
                            //         ? 'p-invalid'
                            //         : ''
                            //     }`
                            // }
                            // style={{
                            //     borderColor: isErrorInputForm(inputError, 'approval') ? 'red' : '',
                            // }}
                            classNamePrefix="select"
                            onChange={(selectedOptions) => {
                                handleChange_typeIOM(selectedOptions);
                            }}
                            value={type}
                        />
                        {isErrorInputForm(
                            inputError,
                            'type',
                        ) && (
                            <small style={{ color: 'red' }} className='p-error'>
                                {errorMessageFormInput(
                                    inputError,
                                    'type',
                                )}
                            </small>
                        )}
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Kategori
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Select
                            name="colors"
                            options={kategoriIOM}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) => {
                                handleChange_Kategori(selectedOptions);
                                console.log('Selected Kategori in Select:', selectedOptions);
                            }}
                            value={category}
                        />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Perihal
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Form.Control
                        type="text"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        // value={perihal}
                        name="about"
                        className={
                            isErrorInputForm(
                                inputError,
                                'about',
                            ) && 'p-invalid'
                        }
                        style={{
                            borderColor: isErrorInputForm(inputError, 'about') ? 'red' : '',
                        }}
                        onChange={onChangeInput} // Menetapkan fungsi handleNomorChange sebagai penangan perubahan input
                    />
                    {isErrorInputForm(
                            inputError,
                            'about',
                        ) && (
                            <small style={{ color: 'red' }} className='p-error'>
                                {errorMessageFormInput(
                                    inputError,
                                    'about',
                                )}
                            </small>
                        )}
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Lampiran
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Form.Control
                        type="text"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        name="attachment"
                        className={
                            isErrorInputForm(
                                inputError,
                                'attachment',
                            ) && 'p-invalid'
                        }
                        style={{
                            borderColor: isErrorInputForm(inputError, 'attachment') ? 'red' : '',
                        }}
                        onChange={onChangeInput} // Menetapkan fungsi handleNomorChange sebagai penangan perubahan input
                    />
                    {isErrorInputForm(
                            inputError,
                            'attachment',
                        ) && (
                            <small style={{ color: 'red' }} className='p-error'>
                                {errorMessageFormInput(
                                    inputError,
                                    'attachment',
                                )}
                            </small>
                        )}
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Attachment File
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <FilePond
                                files={files}
                                onupdatefiles={handleAttachment}
                                allowMultiple={true}
                                maxFiles={3}
                                name="files"
                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                        />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Simpan Sebagai
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <Form>
                        <Form.Check
                            inline
                            label="DRAFT"
                            type="radio"
                            id="draftRadio"
                            name="simpanSebagai"
                            onChange={() => {
                                setSaveAs('DRAFT');
                            }}
                            checked={save_as === 'DRAFT'}
                        />
                        <Form.Check
                            inline
                            label="PUBLISH"
                            type="radio"
                            id="publishRadio"
                            name="simpanSebagai"
                            onChange={() => {
                                setSaveAs('PUBLISH');
                            }}
                            checked={save_as === 'PUBLISH'}
                        />
                        </Form>
                        {isErrorInputForm(
                            inputError,
                            'save_as',
                        ) && (
                            <small style={{ color: 'red' }} className='p-error'>
                                {errorMessageFormInput(
                                    inputError,
                                    'save_as',
                                )}
                            </small>
                        )}
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Urgensi IOM?
                    <span style={{ color: 'red' }}>*</span>
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Form>
                        <Form.Check
                            inline
                            label="TIDAK"
                            type="radio"
                            id="draftRadio"
                            name="simpanSebagai"
                            onChange={() => {
                                setUrgensiIOM(false);
                            }}
                            checked={urgensiIOM === false}
                        />
                        <Form.Check
                            inline
                            label="YA"
                            type="radio"
                            id="publishRadio"
                            name="simpanSebagai"
                            onChange={() => {
                                setUrgensiIOM(true);
                            }}
                            checked={urgensiIOM === true}
                        />
                        </Form>
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={12}>
                    {isErrorInputForm(
                            inputError,
                            'content',
                        ) && (
                            <small style={{ color: 'red' }} className='p-error'>
                                {errorMessageFormInput(
                                    inputError,
                                    'content',
                                )}
                            </small>
                    )}
                    <CKEditor
                    editor={ ClassicEditor }
                    onChange={handleEditorChange}
                    />
                </Col>
            </Row>
            <br/>        
            <Button variant='primary'onClick={handleSubmit} >   
                SAVE
            </Button>
            <br />
        </div>
        // onClick={btnHandle_TambahIOM}
    )
}

export default TambahIOM