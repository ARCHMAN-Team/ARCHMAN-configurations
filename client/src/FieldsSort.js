import React,{useEffect,useState} from 'react'
import './App.css'; 
import axios from 'axios';
import UI from './UI'; // Import the UI component
import Modal from 'react-modal';




function FieldsSort() {
  
  //pop message
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const openModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };


    //Browse
    const [fieldBrowseData, setFieldBrowseData] = useState([]);
    const [leftValuesBrowse, setleftValuesBrowse] = useState([]);
    const [selectedLeftBrowse, setselectedLeftBrowse] = useState('');
    const [showDeleteOptions, setShowDeleteOptions] = useState({});
    const [showAddConfirmationVoc, setshowAddConfirmationVoc] = useState(false); 
    const [showDeleteConfirmationVoc, setshowDeleteConfirmationVoc] = useState(false); 
    const [showSaveConfirmationVoc, setshowSaveConfirmationVoc] = useState(false); 
    const [showSaveConfirmationMap, setshowSaveConfirmationMap] = useState(false); 
    const [showDeleteConfirmationBrowse, setshowDeleteConfirmationBrowse] = useState(false); 

//Send key to server to delete
    const handleDelete = (itemToDelete) => {
      axios
        .post('/api/delete-field-browse', {
          key: itemToDelete,
        })
        .then((response) => {
          console.log(response.data.message);
          const updatedFieldBrowseData = fieldBrowseData.filter(
            (item) => item !== itemToDelete
          );
          setFieldBrowseData(updatedFieldBrowseData);
          setshowDeleteConfirmationBrowse(true);
        })
        .catch((error) => {
          console.error('Error deleting element:', error);
        });
    };
//Add attribute to browse fields 
    const handleSaveBrowse = () => {
      if (!selectedLeftBrowse) {
        return;
      }
  
      axios.post('/api/update-browse', {
        leftValue: selectedLeftBrowse
      })
        .then(response => {
          console.log(response.data.message);
        
          fetchDataBrowse();
          setshowSaveConfirmationVoc(true);
        })
        .catch(error => {
          console.error('Error updating browse:', error);
        });
    };
//left value change
    const handleLeftValueChangeBrowse = (event) => {
      const selectedLeft = event.target.value;
      setselectedLeftBrowse(selectedLeft);
    
    
  
    };
  useEffect(() => {
    fetchDataBrowse();
  }, []);
//Fetch data
  const fetchDataBrowse = () => {
    axios.get('/api/browse-fieldsNew') 
      .then((response) => {
        setFieldBrowseData(response.data);
        console.log(response.data);
        setShowDeleteOptions(new Array(response.data.length).fill(false)); 
      
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
//Process string
  const processUploadStructureBrowse = (uploadStructureString) => {

    const leftA=[];
 

    for (let i = 0; i < uploadStructureString.length; i++) {
leftA.push(uploadStructureString[i].key);

    }


    setleftValuesBrowse(leftA);

  };

    //Field search 
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [deleteKey, setDeleteKey] = useState('');

    //Send key to server to delete
    const handleDeletePair = () => {
      if (!deleteKey) {
        openModal('Enter valid term');
        return;
      }
      console.log(fieldBrowseData);
      if (!leftValuesBrowse.includes(deleteKey)) {
        openModal('Term does not exist in field search data. Cannot delete.');
        return;
      }
    
      axios.post('/api/delete-fieldMain', {
        key: deleteKey
      })
        .then(response => {
          console.log(response.data.message);
          const updatedFieldSearchData = fieldSearchData.filter(item => item.key !== deleteKey);
          setFieldSearchData(updatedFieldSearchData);
          setDeleteKey('');
          setshowDeleteConfirmationVoc(true);
  
          // fetchDataSearch();
        })
        .catch(error => {
          console.error('Error deleting key-value pair:', error);
        });
    };
    //Send new key and value
    const handleAddPair = () => {
      if (!newKey.trim() || !newValue.trim() ) {
        openModal('Please enter attribute and path');
        return;
      } 
  
      axios.post('/api/add-fieldMain', {
        key: newKey,
        value: newValue
      })
        .then(response => {
          console.log(response.data.message);
  
        //  fetchDataSearch();
        setFieldSearchData(prevData => [
          { key: newKey, value: newValue },
          ...prevData
        ]);
          setNewKey('');
          setNewValue('');
          setshowAddConfirmationVoc(true);
        })
        .catch(error => {
          console.error('Error adding new pair:', error);
        });
    };

    //Modal
    const [selectedPair, setSelectedPair] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedValue, setEditedValue] = useState('');
      const handleButtonClick13 = () => {
        setshowFieldsMain(!showFieldsMain);
      };
      const handleButtonClick14 = () => {
        setshowFieldsUser(!showFieldsUser);
      };
    
  //New List Of Fields For Search And Browse And Sort
  const [showFieldsMain,setshowFieldsMain] = useState(false);
  const [showFieldsUser,setshowFieldsUser] = useState(false);
  const [fieldSearchData, setFieldSearchData] = useState(null);
  const [fieldSortData, setFieldSortData] = useState([]);
  const [fieldIndexData, setFieldIndexData] = useState([]);
  const [fileExcludeData, setFileExcludeData] = useState([]);
  const [usersFieldSearchData, setUsersFieldSearchData] = useState({});
  const [fieldBrowseDataUserBrowse, setfieldBrowseDataBrowseUser] = useState([]);
  const [fieldSortDataUser, setfieldSortDataUser] = useState(null); //DO 
  const [fieldIndexDataUser, setFieldIndexDataUser] = useState([]);

  useEffect(() => {
    fetchDataSB();
  }, []);
  //Fetch data
  const fetchDataSB = () => {
    axios.get('/api/upload-fieldsNew')
      .then((response) => {
        const data = response.data;
        const usersRegex = /'users'\s*=>\s*\{[^]*?'field_sort'\s*=>\s*\[\s*((?:[^,\]]*\s*,\s*)*[^,\]]*)\s*\]/;
        const usersMatch = data.match(usersRegex);

        if (usersMatch && usersMatch.length >= 2) {
          const fieldSortString = usersMatch[1];
          const fieldSortArray = fieldSortString.split(',').map((item) => item.trim());
          setfieldSortDataUser(fieldSortArray);
         
        } else {
          console.log('Field_sort data not found or regex did not match.');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  

  useEffect(() => {
    fetchDataUserB();
  }, []);
//Fetch data
  const fetchDataUserB = () => {
    axios.get('/api/upload-fieldsNew')
      .then((response) => {
        const data = response.data;
        const usersRegex = /'users'\s*=>\s*\{\s*((?:[^,]*=>\s*[^,]*,\s*)*)\s*'field_browse'\s*=>\s*\[\s*\[([^\]]*)\]\s*\]/;
        const usersMatch = usersRegex.exec(data);

        if (usersMatch && usersMatch[2]) {
          const fieldBrowseString = usersMatch[2];
          const formattedData = formatData(fieldBrowseString);
          setfieldBrowseDataBrowseUser(formattedData);
        } else {
          //console.error('Field browse data not found in users section');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  //Format string
  const formatData = (dataString) => {
    const dataArray = dataString.split(',');
    const fieldName = dataArray[0].trim();
    const fieldValues = dataArray.slice(1).map((item) => item.trim()).join(', ');
    return `${fieldName}: ${fieldValues}`;
  };

  useEffect(() => {
    fetchDataUsereField();
  }, []);
//Fetch data
  const fetchDataUsereField = () => {
    axios.get('/api/upload-fieldsNew')
      .then((response) => {
        const data = response.data;
        const regex = /'users'\s*=>\s*{[^}]*'field_search'\s*=>\s*{([^}]+)}/;
        const match = regex.exec(data);
        if (match && match[1]) {
          const usersFieldSearchString = match[1];
          const usersFieldSearchData = {};
          usersFieldSearchString
            .split(',')
            .forEach((item) => {
              const [key, value] = item.trim().split(/\s*=>\s*/);
              usersFieldSearchData[key] = value.replace(/['"]/g, '');
            });

          setUsersFieldSearchData(usersFieldSearchData);
        } else {
          console.error('Users field search data not found in response');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };


  useEffect(() => {
    const fetchData = () => {
      axios.get('/api/upload-fieldsNew')
        .then((response) => {
          const data = response.data;
          // Parse the data and extract the field_search section
          const regex = /'field_search' => {([\s\S]*?)},/;
          const match = regex.exec(data);
          if (match && match[1]) {
            const fieldSearchString = match[1];
            // Split the key-value pairs and format them
            const keyValues = fieldSearchString.split(',\n') // Split by new lines
              .map((pair) => {
                const [key, value] = pair.trim().split(' => ');
                return { key, value };
              });
            // Set the field_search data
            setFieldSearchData(keyValues);
            processUploadStructureBrowse(keyValues);
          } else {
            console.error('Field search data not found in response');
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };
  
    // Initial fetch
    fetchData();
  
    const pollingInterval = setInterval(() => {
      fetchData(); // Fetch data every second
    }, 1000);
  
    // Cleanup the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);
//Handle selected
  const handleOptionSelect = (selectedPair) => {
    setSelectedPair(selectedPair);
    setEditedValue(selectedPair.value);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedPair(null);
    setEditedValue('');
    setIsModalOpen(false);
  };

  //Handle new value save
  const handleEditSave = () => {
    if (!selectedPair || !editedValue) {
      return;
    }

    axios.post('/api/update-fieldMain', {
      key: selectedPair.key,
      value: editedValue
    })
      .then(response => {
        console.log(response.data.message);
      
        // Update the fieldSearchData state with the edited value
        const updatedFieldData = fieldSearchData.map(item => {
          if (item.key === selectedPair.key) {
            return { ...item, value: editedValue };
          }
          return item;
        });
        setFieldSearchData(updatedFieldData);
       setshowSaveConfirmationMap(true);
        handleModalClose();
        
      })
      .catch(error => {
        console.error('Error updating field:', error);
      });
  };
    return (
        <>


<div className="vocabulary-section">
          <h2 style={{ color: 'black', fontSize: '10px' }}>List Of Fields For Search And Browse And Sort:</h2>
          <p>To edit a mapping of a field, click on the field</p>
        
        <div>
        {fieldSearchData && (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Mapping</th>
                </tr>
              </thead>
              <tbody>
                {fieldSearchData.map((item, index) => (
                  <tr key={index} onClick={() => handleOptionSelect(item)}>
                    <td>{item.key}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
        <h2>Add new metadata attribute and attribute path</h2>
        <input
          type="text"
          placeholder="Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <button onClick={handleAddPair}>Add</button>
        <Modal
  isOpen={showModal}
  onRequestClose={() => setShowModal(false)}
  contentLabel="Confirmation Modal"
  style={{
    content: {
      width: '300px', 
      margin: 'auto', // Center the modal
      height: '200px',
    },
  }}
>
  <div>
    <p>{modalMessage}</p>
    <button onClick={() => setShowModal(false)}>Close</button>
  </div>
</Modal>
        {showAddConfirmationVoc && (
      <Modal
        isOpen={showAddConfirmationVoc}
        onRequestClose={() => setshowAddConfirmationVoc(false)}
        contentLabel="Add Confirmation"
        style={{
          content: {
            width: '300px',
            margin: 'auto',
            height: '200px',
          },
        }}
      >
        <h2>Add Confirmation</h2>
        <p>Term added successfully.</p>
        <button onClick={() => setshowAddConfirmationVoc(false)}>OK</button>
      </Modal>
    )}
        <div>
      
      <h2>Delete metadata attribute</h2>
      <input
        type="text"
        placeholder="Key"
        value={deleteKey}
        onChange={(e) => setDeleteKey(e.target.value)}
      />
      <button onClick={handleDeletePair}>Delete</button>
      <Modal
  isOpen={showModal}
  onRequestClose={() => setShowModal(false)}
  contentLabel="Confirmation Modal"
  style={{
    content: {
      width: '300px', 
      margin: 'auto', // Center the modal
      height: '200px',
    },
  }}
>
  <div>
    <p>{modalMessage}</p>
    <button onClick={() => setShowModal(false)}>Close</button>
  </div>
</Modal>
      {showDeleteConfirmationVoc && (
      <Modal
        isOpen={showDeleteConfirmationVoc}
        onRequestClose={() => setshowDeleteConfirmationVoc(false)}
        contentLabel="Add Confirmation"
        style={{
          content: {
            width: '300px',
            margin: 'auto',
            height: '200px',
          },
        }}
      >
        <h2>Delete Confirmation</h2>
        <p>Field attribute deleted successfully.</p>
        <button onClick={() => setshowDeleteConfirmationVoc(false)}>OK</button>
      </Modal>
    )}
   
    </div>
    <div>
   
      <h2>Current Field Browse Data:</h2>
      <p>Change metadata attributes that users can search using</p>
      <div>
  <div className="list-container">
    {fieldBrowseData.map((item, index) => (
      <div key={index} className="list-item">
        {item}
        <button onClick={() => handleDelete(item)}>Delete</button>
        {showDeleteConfirmationBrowse && (
      <Modal
        isOpen={showDeleteConfirmationBrowse}
        onRequestClose={() => setshowDeleteConfirmationBrowse(false)}
        contentLabel="Add Confirmation"
        style={{
          content: {
            width: '300px',
            margin: 'auto',
            height: '200px',
          },
        }}
      >
        <h2>Delete Confirmation</h2>
        <p>Browse attribute deleted successfully.</p>
        <button onClick={() => setshowDeleteConfirmationBrowse(false)}>OK</button>
      </Modal>
    )}
      </div>
    ))}
  </div>
</div>
      <div className="select-container">
       
       <select value={selectedLeftBrowse} onChange={handleLeftValueChangeBrowse}>
         {leftValuesBrowse.map((value, index) => (
           <option key={index} value={value}>{value}</option>
         ))}
       </select>
       <button onClick={handleSaveBrowse}>Save</button>
       {showSaveConfirmationVoc && (
      <Modal
        isOpen={showSaveConfirmationVoc}
        onRequestClose={() => setshowSaveConfirmationVoc(false)}
        contentLabel="Add Confirmation"
        style={{
          content: {
            width: '300px',
            margin: 'auto',
            height: '200px',
          },
        }}
      >
        <h2>Save Confirmation</h2>
        <p>Field attribute saved successfully.</p>
        <button onClick={() => setshowSaveConfirmationVoc(false)}>OK</button>
      </Modal>
    )}
     </div>
    </div>
      </div>
          </>
        )}
  
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleModalClose}
          contentLabel="Edit Key-Value Pair"
        >
          <h2>Edit Key-Value Pair</h2>
          {selectedPair && (
            <>
              <p>Edit the mapping for:</p>
              <p>Field: {selectedPair.key}</p>
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
              />
              <button onClick={handleEditSave}>Save</button>
              <button onClick={handleModalClose}>Cancel</button>
            </>
          )}
        </Modal>
        {showSaveConfirmationMap && (
      <Modal
        isOpen={showSaveConfirmationMap}
        onRequestClose={() => setshowSaveConfirmationMap(false)}
        contentLabel="Add Confirmation"
        style={{
          content: {
            width: '300px',
            margin: 'auto',
            height: '200px',
          },
        }}
      >
        <h2>Save Confirmation</h2>
        <p>Value saved successfully.</p>
        <button onClick={() => setshowSaveConfirmationMap(false)}>OK</button>
      </Modal>
    )}
      </div>
     
        
    
      <div>
   
  
        </div>
        </div>
    </>
    );

}
export default FieldsSort