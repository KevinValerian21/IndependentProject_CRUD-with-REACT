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


const PagesUbah = () => {
    // Halaman berikutnya (misalnya, di komponen React atau fungsi terkait)
    const storedData = localStorage.getItem('dataUser');
    const userData = storedData ? JSON.parse(storedData) : null;
    const [readData, setReadData] = useState([]);
    const [readUserApproval, setReadUserApproval] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [fromName, setFromName] = useState('');
    const [inputError, setInputError] = useState([])


    const navigate = useNavigate();
    
    // Get the dynamic parameter from the URL.
    let { pageId } = useParams(); 

    //Fetching Read Data
    useEffect(() => {
        fetch(`https://github.modernland.co.id/api/v1/iom/${pageId}/detail`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userData.accessToken}`,
                'Content-Type': 'application/json'
            },
        })
          .then(response => response.json())
          .then(data => {
            setReadData(data.result);
            // Mengambil nilai dari from.name
            setFromName(data.result.from.map((from) => from.name));
            // console.log(data.result.from.map((from) => from.name))
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []); // Gunakan array dependencies kosong agar efek hanya dijalankan sekali setelah mounting
    

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
        
        // console.log(data.result)
        })
        .catch(error => {
        console.error('Error fetching data:', error);
        });
    }, []);

    function showData(){
        console.log(readData)
    }

    //Navigasi Handler
    function btnHandle_backHome() {
        navigate('/Home');

    }
    function btnHandle_backDataIOM() {
        navigate('/DataIOM');

    }

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

     
    return (
        <div className="container">
            <br />
            <div className="container-fluid">
                <Breadcrumb >
                    <Breadcrumb.Item onClick={btnHandle_backHome}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={btnHandle_backDataIOM}>
                        Data IOM
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Ubah IOM</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <h2>Ubah</h2>
            <div>
            </div>
            <br />
            

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
                        // value={currentDate}
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
                            value={fromName.label} // Set nilai dari dropdown Dari dari state
                            // onChange={handleChange_Dari} // Set fungsi handleOnChange_Dari sebagai penangan perubahan input
                        />
                    </div>
                </Col>
            </Row>
            <br />
            {/* <Row className="container-fluid">
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
            </Row> */}
            <br/>   
            <br />
            <Button variant='primary' onClick={showData}>   
                Cek Console
            </Button>
            <br />
            <Form>
                
            </Form>
        </div>
        
    )
}

export default PagesUbah