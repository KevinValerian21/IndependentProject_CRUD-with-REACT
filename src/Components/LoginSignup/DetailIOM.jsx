import React, { useState } from 'react'
import './LoginSignup.css'
import Table from 'react-bootstrap/Table';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import { ButtonGroup, Dropdown } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';


const DetailIOM = () => {
    // Halaman berikutnya (misalnya, di komponen React atau fungsi terkait)
    const storedData = localStorage.getItem('dataUser');
    const userData = storedData ? JSON.parse(storedData) : null;
    const navigate = useNavigate();

    function btnHandle_backHome() {
        navigate('/Home');

    }
    function btnHandle_backDataIOM() {
        navigate('/DataIOM');

    }

    // Di halaman DetailIOM
    const htmlContent = localStorage.getItem('htmlContent');
    // Gunakan htmlContent sesuai kebutuhan Anda pada halaman ini
     
    return (
        <div className="container">
            <br /> 
            <div className="container-fluid">
                <Breadcrumb >
                    <Breadcrumb.Item onClick={btnHandle_backHome}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={btnHandle_backDataIOM}>
                        Data IOM
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Detail IOM</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            
            <select className="input"  
                defaultValue="DEFAULT"
                style={{ width: '100px', height: '45px', marginLeft: '5px' }}>
                    <option value="DEFAULT">DEFAULT</option>
                    <option value="JGC">JGC</option>
            </select>
             {/* Menampilkan htmlContent setelah elemen select */}
             <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
        
    )
}

export default DetailIOM