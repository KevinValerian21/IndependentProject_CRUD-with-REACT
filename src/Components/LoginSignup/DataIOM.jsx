import React, { useState, useEffect } from 'react'
import './LoginSignup.css'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';
import Modal from 'react-bootstrap/Modal';

import imageUnduh from '../Assets/ic_unduh.png';
import imageUnduhPutih from '../Assets/ic_unduhPutih.png';
import imageComboBox from '../Assets/ic_comboBox.png';
import imagePrint from '../Assets/ic_print.png';


const DataIOM = () => {
    // Halaman berikutnya (misalnya, di komponen React atau fungsi terkait)
    const storedData = localStorage.getItem('dataUser');
    const userData = storedData ? JSON.parse(storedData) : null;
    const [allDataIOM, setAllDataIOM] = useState([])
    const [approvalDurations, setApprovalDurations] = useState([]); // Tambahkan state baru
    const navigate = useNavigate();
    const [sortByValue, setSortByValue] = useState('');
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [allDatabyID, setAllDatabyID] = useState([])
    const [pathFile, setPathFile] = useState([])
    const [toDownload, setToDownload] = useState('')




    //Modals
    const [showModal, setShowModal] = useState(false);
   
    const handleOpenModal = (itemID) => {
        // Fetch dengan menggunakan Selected itemID
        fetch(`https://github.modernland.co.id/api/v1/iom/${itemID}/detail`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userData.accessToken}`,
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Parse the JSON response
                } else {
                    throw new Error('User not found');
                }
            })
            .then((data) => {
                setAllDatabyID(data.result); // Simpan data ke state
                const paths = data.result.attachment_file.map((file) => file.path);
                setPathFile(paths);
            })
            .catch(error => console.error('Error:', error));
        
        setSelectedItemId(itemID);
        setShowModal(true);
    }
    const handleCloseModal = () => setShowModal(false);



    function handleSort(event) {
        setSortByValue(event.target.value, () => {
            Btn_sortValue(); // Panggil Btn_sortValue setelah pembaruan nilai selesai
        });
    }
    useEffect(() => {
        Btn_sortValue(); // Memanggil Btn_sortValue() saat komponen pertama kali di-render
    }, [sortByValue]);

    const handleDownload = async (path, file) => {
        try {
            const response = await fetch('https://github.modernland.co.id/api/v1/aws-s3/download', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path_file: path,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
    
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.originalname);
            document.body.appendChild(link);
    
            link.click();
    
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    function Btn_sortValue() {
        // Fetch dengan menggunakan sortByValue
        fetch(`https://github.modernland.co.id/api/v1/iom?limit=${sortByValue}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userData.accessToken}`,
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Parse the JSON response
                } else {
                    throw new Error('User not found');
                }
            })
            .then((data) => {
                // Check if the 'result' array is present in the response
                if (data && data.result) {
                    // Hitung durasi approval dalam hari untuk setiap item
                    const durations = data.result.data.map((item) => {
                        const createdDate = parseISO(item.created_at);
                        const now = new Date();
                        const duration = differenceInDays(now, createdDate);
                        return duration;
                    });
                    setAllDataIOM(data.result.data); // Simpan data ke state
                    const valueID = allDataIOM.map((item) => {
                        const idValue = item.id;
                        return idValue;
                    });
                    setApprovalDurations(durations);
                    console.log(valueID)
                } else {
                    // Handle the case where the expected data structure is not present
                    throw new Error('Invalid response format');
                }
            })
            .catch(error => console.error('Error:', error));
    }
    


    //Logout Handle
    function handleLogout() {
        localStorage.setItem('Login', false);
        // Menghapus semua nilai dari localStorage
        localStorage.clear();
        navigate('/');
    }


    //Format Date Handle
    const formatDate = (dateString) => {
        const parsedDate = parseISO(dateString);
        const formattedDate = format(parsedDate, 'dd-MMM-yyyy HH:mm', { locale: enUS });
        return formattedDate;
    };

    //HANDLE DROPDOWN


    const handlePrint = async (id) => {
        try {
            const response = await fetch(`https://github.modernland.co.id/api/v1/iom/view/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`,
                    'Content-Type': 'application/html',
                }
            });
    
            if (!response.ok) {
                console.error('Failed to fetch file:', response.statusText);
                return;
            }
    
            const htmlContent = await response.text();
    
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
    
            document.body.appendChild(iframe);
            iframe.contentDocument.write(htmlContent);
            iframe.contentDocument.close();
    
            // Print setelah memastikan bahwa konten sudah dimuat dengan baik
            iframe.onload = function () {
                iframe.contentWindow.print();
                document.body.removeChild(iframe);
            };
    
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const btnHandle_Detail = async (id) => {
        try {
            const response = await fetch(`https://github.modernland.co.id/api/v1/iom/view/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`,
                    'Content-Type': 'application/html',
                }
            });
    
            if (!response.ok) {
                console.error('Failed to fetch file:', response.statusText);
                return;
            }
    
            const htmlContent = await response.text();
            // console.log(htmlContent)

            // Simpan htmlContent di localStorage
            localStorage.setItem('htmlContent', htmlContent);
            

            // navigate(`/DetailIOM/${id}`);
            navigate(`/DetailIOM`);

        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const btnHandle_UbahIOM = async (id) => {
        navigate(`/PagesUbah/${id}`);
    }
    const btnHandle_CopyID = async (id) => {
        navigator.clipboard
        .writeText(id)
    }
    function btnHandle_CreateIOM() {
        navigate('/TambahIOM')
    }
    
    
    
    return (
            <Container>
                <br />
                <Row>
                    <h3 style={{ color: 'black', textAlign: 'center' }}>
                        DATA IOM GAESS!!!
                    </h3>
                </Row>
                <Row xs={1} md={2}>
                    <Col>
                        <Button variant='primary'
                        style={{ width: '70px', height: '45px', marginLeft: '-810%'  }}
                        onClick={btnHandle_CreateIOM}
                        >
                            Create
                        </Button>
                    </Col>

                    <Col>
                    <select className="input"  
                        onChange={handleSort} 
                        defaultValue="10"
                        style={{ width: '70px', height: '45px', marginLeft: '810%'  }}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                    </select>
                    </Col>
                </Row>
                <br />

                <Row>
                    <Table
                    striped
                    bordered
                    hover
                    variant="dark"
                    style={{ background: 'lightgray' }}
                    >
                    <thead>
                        <tr>
                            <th >Pilihan</th>
                            <th >Nomor</th>
                            <th >Jenis</th>
                            <th >Kategori</th>
                            <th >Perihal</th>
                            <th >Disimpan Sebagai</th>
                            <th >File</th>
                            <th >Status</th>
                            <th >Dibuat</th>
                            <th >Durasi Approval</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allDataIOM.map((item, index) => (
                            <tr key={index}  >
                                <td>
                                <ButtonGroup>
                                    <Button variant='primary' style={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={imagePrint} alt="Download Icon" style={{ width: '25px', height: '25px' }} />
                                        <span style={{ marginLeft: '5px' }} onClick={() => handlePrint(item.id)}>Cetak</span>
                                    </Button>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id="dropdown-split-basic" split />
                                        <Dropdown.Menu style={{ marginLeft: '-95px', width: "150px" }}>
                                            <Dropdown.Item onClick={() => btnHandle_Detail(item.id)}>Detail</Dropdown.Item>
                                            <Dropdown.Item onClick={() => btnHandle_UbahIOM(item.id)}>Ubah</Dropdown.Item>
                                            <Dropdown.Item onClick={() => btnHandle_CopyID(item.id)}>Copy ID</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </ButtonGroup>
                                </td>
                                <td style={{ textAlign: 'center'}}>{item.code}</td>
                                <td>{item.type}</td>
                                <td>{item.category}</td>
                                <td>{item.about}</td>
                                <td>{item.save_as}</td>
                                <td>
                                    <Button variant='light' id='btn-file'  onClick={() => handleOpenModal(item.id)}>
                                        <img src={imageUnduh} alt="Download Icon" style={{ width: '25px', height: '25px' }}/>    
                                    </Button>
                                     {/* Modal */}
                                    <Modal show={showModal} onHide={handleCloseModal} centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title>{allDatabyID.code}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {/* Isi modal di sini */}
                                            <Table striped bordered hover variant="dark">
                                                <thead>
                                                    <tr>
                                                    <th>No</th>
                                                    <th>File Name</th>
                                                    <th>Download</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(allDatabyID.attachment_file) && allDatabyID.attachment_file.map((file, fileIndex) => (
                                                        <tr key={fileIndex}>
                                                            <td>{fileIndex + 1}</td>
                                                            <td>{file.originalname}</td>
                                                            <td style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                {/* Here, you can add the download functionality using the file.path */}
                                                                <Button variant='success' id={`btn-unduh-${fileIndex}`} onClick={() => handleDownload(pathFile[fileIndex], file)}>
                                                                    <img src={imageUnduhPutih} alt="Download Icon" style={{ width: '35px', height: '25px' }}/>    
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleCloseModal}>
                                                Close
                                            </Button>
                                            {/* Tambahkan tombol-tombol lain jika diperlukan */}
                                        </Modal.Footer>
                                    </Modal>
                                </td>
                                <td >
                                    {/* Gunakan kondisi untuk menentukan jenis Button */}
                                    {item.status === 'DISETUJUI' ? (
                                    <Button variant="success" style={{ fontWeight: 'bold', color: 'white' }} >DISETUJUI</Button>
                                    ) : item.status === 'MENUNGGU_PERSETUJUAN' ? (
                                    <Button variant="warning" style={{ fontWeight: 'bold', color: 'white' }}>MENUNGGU PERSETUJUAN</Button>
                                    ) : item.status === 'DITOLAK' ? (
                                    <Button variant="danger" style={{ fontWeight: 'bold', color: 'white' }}>DITOLAK</Button>
                                    ) : (
                                    // Jika status tidak sesuai dengan yang diharapkan
                                    item.status
                                    )}
                                </td>
                                <td>{formatDate(item.created_at)}</td>
                                <td>{approvalDurations[index]} hari</td>

                                {/* Tambahkan kolom lain sesuai kebutuhan */}
                            </tr>
                        ))}
                    </tbody>
                    </Table>

                    <div>
                        <Button variant='primary' onClick={handleLogout}>Logout</Button>
                    </div>
                </Row>
            </Container>
    )
}

export default DataIOM