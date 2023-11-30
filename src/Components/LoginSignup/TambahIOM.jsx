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

    const [editorData, setEditorData] = useState('');

    // Menyimpan nilai input dari Form
    const [tanggal, setTanggal] = useState('');
    const [nomor, setNomor] = useState('');
    const [dari, setDari] = useState([]);
    const [kepada, setKepada] = useState([]);
    const [cc, setCC] = useState([]);
    const [klasifikasi, setKlasifikasi] = useState([]);
    const [userApproval, setUserApproval] = useState('');
    const [jenis, setJenis] = useState('');
    const [kategori, setKategori] = useState('');
    const [perihal, setPerihal] = useState('');
    const [lampiran, setLampiran] = useState('');
    const [saveAs, setSaveAs] = useState('');
    const [urgensiIOM, setUrgensiIOM] = useState('');


    
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
    
    // function btnHandle_TambahIOM() {
    //     const data = {
    //         code                : ,
    //         category            : ,
    //         about               : ,
    //         attachment          : ,
    //         content             : ,
    //         from                : ,
    //         to                  : ,
    //         cc                  : ,
    //         files               : ,
    //         approval            : ,
    //         important           : ,
    //         aggrement           : , 
    //         to_note             : ,
    //         as_information      : ,
    //         setItem             : ,
    //         save_as             : ,

    //     }
    // }
    
    function btnHandle_TambahIOM(){
        const form = {
            code                : nomor,
            category            : kategori,
            about               : perihal,
            content             : editorData,
            from                : dari,
            to                  : kepada,
            cc                  : cc,
            approval            : pilihanApproval,
        }

        const formData = new FormData()
        formData.append("code", nomor)
        formData.append("category", kategori)
        formData.append("about", perihal)
        formData.append("content", editorData)
        formData.append("from", dari)
        formData.append("to", kepada)
        formData.append("cc", cc)
        formData.append("about", perihal)

        
        console.log(form)
    }

    
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
    }, [saveAs]);
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

    function handleAttachment(files){
        // console.log(files)
        const file_temp = files.map(file => {
            setFiles(file)
        })
    }
 
    // Fungsi untuk menangani perubahan input Nomor
    const handleChange_Nomor = (event) => {
        setNomor(event.target.value);
    };
    useEffect(() => {
        console.log(nomor);
    }, [nomor]);
    // Fungsi untuk menangani perubahan input Dari
    const handleChange_Dari = (selectedOptions) => {
        setDari(selectedOptions);
        console.log(selectedOptions) // Set nilai dari dropdown Dari ke state
    };
    // Fungsi untuk menangani perubahan input Kepada
    const handleChange_Kepada = (selectedOptions) => {
        setKepada(selectedOptions); // Set nilai dari dropdown Dari ke state
    };
    // Fungsi untuk menangani perubahan input CC
    const handleChange_CC = (selectedOptions) => {
        setCC(selectedOptions); // Set nilai dari dropdown Dari ke state
    };
    // Fungsi untuk menangani perubahan checkbox Klasifikasi
    const handleKlasifikasiChange = (event) => {
        const selectedValue = event.target.value;
        const isChecked = event.target.checked;

        // Jika checkbox dicentang, tambahkan nilai ke dalam array
        // Jika checkbox dicentang, hapus nilai dari dalam array
        setSelectedKlasifikasi((prevSelected) => {
        if (isChecked) {
            return [...prevSelected, selectedValue];
        } else {
            return prevSelected.filter((value) => value !== selectedValue);
        }
        });
    };
    // Fungsi untuk menangani perubahan input typeIOM
    const handleChange_typeIOM = (selectedOptions) => {
        setJenis(selectedOptions);
    };
    // Fungsi untuk menangani perubahan input typeIOM
    const handleChange_Kategori = (selectedOptions) => {
        setKategori(selectedOptions);
    };
    // Fungsi untuk menangani perubahan input Perihal
    const handleChange_Perihal = (event) => {
        setPerihal(event.target.value);
        console.log(perihal)
    };
    // Fungsi untuk menangani perubahan input Lampiran
    const handleChange_Lampiran = (event) => {
        setLampiran(event.target.value);
        console.log(lampiran)
    };
    const [showModal, setShowModal] = useState(false);
    const handleUserFieldClick = () => {
        setShowModal(true);
      };
    const [pilihanApproval, setPilihanApproval] = useState("");
    const handlebtn_pilihanApproval = (value) => {
        setPilihanApproval(value)
        setShowModal(false);
    }

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
        console.log('Data from CKEditor:', editorData)
    };
    const handleSave = () => {
        console.log('Successfuly to Get Text:', editorData)
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
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Form.Control
                        type="text"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        value={nomor}
                        onChange={handleChange_Nomor} // Menetapkan fungsi handleNomorChange sebagai penangan perubahan input
                    />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Dari
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <Select
                            isMulti
                            name="dari"
                            options={readUserApproval}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={dari} // Set nilai dari dropdown Dari dari state
                            onChange={handleChange_Dari} // Set fungsi handleOnChange_Dari sebagai penangan perubahan input
                        />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Kepada
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
                        value={kepada}
                    />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    CC
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
                        value={cc}
                    />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Klasifikasi
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <div key={`inline-checkbox`} className="mb-4">
                            <Form.Check
                                inline
                                label="Penting"
                                value="Penting"
                                name="group1"
                                type="checkbox"
                                id={`inline-checkbox-1`}
                                onChange={handleKlasifikasiChange}
                            />
                            <Form.Check
                                inline
                                label="Persetujuan"
                                value="Persetujuan"
                                name="group1"
                                type="checkbox"
                                id={`inline-checkbox-2`}
                                onChange={handleKlasifikasiChange}
                            />
                            <Form.Check
                                inline
                                label="Untuk Diperhatikan"
                                value="Untuk Diperhatikan"
                                type="checkbox"
                                id={`inline-checkbox-3`}
                                onChange={handleKlasifikasiChange}
                            />
                            <Form.Check
                                inline
                                label="Sebagai Informasi"
                                value="Sebagai Informasi"
                                type="checkbox"
                                id={`inline-checkbox-4`}
                                onChange={handleKlasifikasiChange}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    User Yang Menyetujui
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <Form.Control
                        type="text"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        onClick={handleUserFieldClick}
                        value={pilihanApproval}
                        />
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
                            <Button style={{marginLeft: '180px'}} onClick={() => handlebtn_pilihanApproval(item.name)}>Pilih</Button>
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
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <Select
                            name="colors"
                            options={typeIOM}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) => {
                                handleChange_typeIOM(selectedOptions);
                            }}
                            value={jenis}
                        />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Kategori
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
                            value={kategori}
                        />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Perihal
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Form.Control
                        type="text"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        value={perihal}
                        onChange={handleChange_Perihal} // Menetapkan fungsi handleNomorChange sebagai penangan perubahan input
                    />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Lampiran
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                    <Form.Control
                        type="text"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        value={lampiran}
                        onChange={handleChange_Lampiran} // Menetapkan fungsi handleNomorChange sebagai penangan perubahan input
                    />
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Attachment File
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
                            checked={saveAs === 'DRAFT'}
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
                            checked={saveAs === 'PUBLISH'}
                        />
                        </Form>
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={2} style={{ verticalAlign: 'middle' }}>
                    Urgensi IOM?
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
                                setUrgensiIOM('TIDAK');
                            }}
                            checked={urgensiIOM === 'TIDAK'}
                        />
                        <Form.Check
                            inline
                            label="YA"
                            type="radio"
                            id="publishRadio"
                            name="simpanSebagai"
                            onChange={() => {
                                setUrgensiIOM('YA');
                            }}
                            checked={urgensiIOM === 'YA'}
                        />
                        </Form>
                    </div>
                </Col>
            </Row>
            <br />
            <Row className="container-fluid">
                <Col sm={12}>
                    <CKEditor
                    editor={ ClassicEditor }
                    onChange={handleEditorChange}
                    />
                </Col>
            </Row>
            <br/>        
            <Button variant='primary'onClick={btnHandle_TambahIOM} >   
                SAVE
            </Button>
            <br />
        </div>
        // onClick={btnHandle_TambahIOM}
    )
}

export default TambahIOM