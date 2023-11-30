import React, { useState } from 'react'
import './LoginSignup.css'
import Table from 'react-bootstrap/Table';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useAsyncError, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { useEffect } from 'react';
import Select from 'react-select'



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



    const handleUserChange = (event) => {
        const value = event.target.value;
        if (event.target.checked) {
          setSelectedUserIds((prevSelectedUserIds) => [...prevSelectedUserIds, value]);
        } else {
          setSelectedUserIds((prevSelectedUserIds) =>
            prevSelectedUserIds.filter((id) => id !== value)
          );
        }
      };

    //Navigasi Handler
    function btnHandle_backHome() {
        navigate('/Home');

    }
    function btnHandle_backDataIOM() {
        navigate('/DataIOM');

    }
    

     
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
                    Nomor
                </Col>
                <Col sm={10}>
                    <div className="form-group">
                        <Form.Control
                            type="text"
                            id="inputPassword5"
                            size="lg"
                            aria-describedby="passwordHelpBlock"
                            defaultValue={readData.code}
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
                    <Select
                        isMulti
                        defaultValue={[readUserApproval[0]]}
                        name="colors"
                        options={readUserApproval}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
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
                            size="lg"
                            aria-describedby="passwordHelpBlock"
                            defaultValue={readData.about}
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
                            size="lg"
                            aria-describedby="passwordHelpBlock"
                            defaultValue={readData.attachment}
                        />
                    </div>
                </Col>
            </Row>
            <br />
            <Button variant='primary'>   
                Cek Console
            </Button>
            <br />
            <Form>
                
            </Form>
        </div>
        
    )
}

export default PagesUbah