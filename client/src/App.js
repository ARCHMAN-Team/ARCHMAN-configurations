import React,{useEffect,useState} from 'react'
import './App.css'; 
import axios from 'axios';
import UI from './UI'; 
import Modal from 'react-modal';
import FieldsSort from './FieldsSort';




function App() {


  //System and UI configurations
  const [showInfo1, setShowInfo1] = useState(false);
  const [showInfo2, setShowInfo2] = useState(false);

  //List of fields for search and browse 
  const [showFieldsNew, setshowFieldsNew] = useState(false);
  //Show fields 
  const handleButtonClick10 = () => {
    setshowFieldsNew(!showFieldsNew);
  };

  //New formats upload
  const [showInfoAF, setShowInfoAF] = useState(false);
  const [formats, setFormats] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
//Delete confirmation
const openDeleteConfirmationModal = () => {
  setShowDeleteConfirmationModal(true);
};
//Setting modal response 
const openModal = (message) => {
  setModalMessage(message);
  setShowModal(true);
};
//Fetch data 
  useEffect(() => {
    fetch('/api/aff')
      .then((response) => response.json())
      .then((data) => {
        setFormats(data.acceptableFileFormats);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

//Adding format
  const handleAdd = (event) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      openModal('Please enter a valid format.');
    } else if (formats && formats.includes(inputValue)) {
      openModal('Format already exists!');
      setInputValue('');
    } else {
      const data = {
        variableName: inputValue
      };
  
      fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          console.log('Response:', result);
          setFormats(prevFormats => [...prevFormats, inputValue]);
          setInputValue('');
          openModal('Format added successfully!');
        })
        .catch(error => {
          console.error('Error:', error);
          openModal('Error adding format!');
        });
    }
  };
//Delete confirmation?
  const handleDeleteConfirmed = () => {
    const data = {
      variableName: inputValue
    };
  
    fetch('/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        console.log('Response:', result);
        setFormats(prevFormats => prevFormats.filter(format => format !== inputValue));
        setInputValue('');
        openModal('Format deleted successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        openModal('Error deleting message!');
      });
  };
//Deleting format
  const handleDelete = (event) => {
    event.preventDefault();
    if (!formats || !formats.includes(inputValue)) {
      openModal('Format not found for deletion!');
      setInputValue('');
    } else {
      openDeleteConfirmationModal();
    }
  };


  //New Administrator accounts and password
    const [showAdmin, setshowAdmin] = useState(false);
    const [administrators, setAdministrators] = useState([]);
    const [verifySalt, setVerifySalt] = useState(null);
    const [inputValueAdmin, setInputValueAdmin] = useState('');
    const [inputValueSalt, setinputValueSalt] = useState(''); 
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedAdministrator, setSelectedAdministrator] = useState('');
    const [showAddConfirmation, setShowAddConfirmation] = useState(false);
    const [addedAdministrator, setAddedAdministrator] = useState('');
    const [userExistsForAdd, setUserExistsForAdd] = useState(false);
    const [showSaltUpdateConfirmation, setShowSaltUpdateConfirmation] = useState(false);
    //Delete admin ID confirmation and deleting admin ID
    const handleDeleteAdministrator = (accountId) => {
        setSelectedAdministrator(accountId);
        setShowConfirmation(true);
      }; const handleConfirmDelete = () => {
        // Perform the delete operation for selectedAdministrator
        axios
          .post('/api/delete-administrator', { accountId: selectedAdministrator })
          .then(response => {
            console.log(response.data.message);
            // Remove the deleted administrator from the state
            setAdministrators(prevAdministrators => prevAdministrators.filter(id => id !== selectedAdministrator));
            setSelectedAdministrator('');
            setShowConfirmation(false);
          })
          .catch(error => {
            console.error('Error deleting administrator:', error);
          });
      };
    
      //If user does not want delete admin ID
      const handleCancelDelete = () => {
        setSelectedAdministrator('');
        setShowConfirmation(false);
      };
    
      //Fetch data
      useEffect(() => {
        axios.get('/api/administrators')
          .then(response => {
            const { administrators, verifySalt } = response.data;
            setAdministrators(administrators);
            setVerifySalt(verifySalt);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);
      const handleCancelAdd = () => {
        setShowAddConfirmation(false);
      };
      const handleInputChangeAdmin = (event) => {
        setInputValueAdmin(event.target.value);
      };
    
      //Handle password input change
      const handleSalt = (event) => {
        setinputValueSalt(event.target.value);
      };
      //Handle adding admin ID
      const handleAddAdministrator = (event) => {
        event.preventDefault();
        const data = {
          administratorId: inputValueAdmin
        };
          // Check if the administrator ID already exists before adding
  if (administrators.includes(inputValueAdmin)) {
    // Display a message or handle the case where the administrator already exists
    setUserExistsForAdd(true);
      setShowAddConfirmation(true);
    return; // Don't proceed with adding the administrator
  }
  if (!/^\d+$/.test(inputValueAdmin)) {
    openModal('Please enter a valid numeric admin ID.');
    return;
  }
        fetch('/api/add-administrator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(result => {
            console.log('Response:', result);
            setAdministrators(prevAdministrators => [...prevAdministrators, inputValueAdmin]);
            setInputValueAdmin('');
            setAddedAdministrator(inputValueAdmin); // Set the added administrator for confirmation message
            setShowAddConfirmation(true);
            setUserExistsForAdd(false);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      };
      //Handle sendning data to server to change password
      const handleUpdateSalt = (event) => {
        event.preventDefault();
      
        axios
          .post('/api/update-verify-salt', { verifySalt: inputValueSalt })
          .then((response) => {
            console.log('Salt updated successfully');
            // Update the verifySalt state instead of reloading the page
            setVerifySalt(inputValueSalt);
            setinputValueSalt('');
            setShowSaltUpdateConfirmation(true); // Set the state to show the confirmation message
          })
          .catch((error) => {
            console.error('Error updating salt:', error);
          });
      };

    //Seperators 
    const [showSeparators, setshowSeparators] = useState(false);
    const [separators, setSeparators] = useState({});
    const [selectedOption, setSelectedOption] = useState('');
    const [inputSep, setinputSep] = useState('');
    const [showSeparatorUpdateConfirmation, setShowSeparatorUpdateConfirmation] = useState(false);
    //Fetch the data and populate all seperators with respective values
    useEffect(() => {
      axios.get('/api/separators')
        .then(response => {
          const { separator, separator2, separatorClean, separator2Clean } = response.data;
          setSeparators({ separator, separator2, separatorClean, separator2Clean });
        })
        .catch(error => {
          console.error('Error fetching separators:', error);
        });
    }, []);
    //Handle sending data to server 
    const handleSeparatorUpdate = (event) => {
      event.preventDefault();
      if (!inputSep.trim()) {
        openModal('Please enter a valid seperator.');
        return;
      }
      // Send the selected separator and new separator value to the server
      const data = {
        selectedOption: selectedOption,
        inputSep: inputSep,
      };
    
      axios
        .post('/api/update-separator', data)
        .then((response) => {
          console.log('Separator updated successfully');
          // Update the separators state locally instead of reloading the page
          setSeparators((prevSeparators) => ({
            ...prevSeparators,
            [selectedOption]: inputSep,
          }));
          setinputSep('');
          setShowSeparatorUpdateConfirmation(true); // Show confirmation modal
        })
        .catch((error) => {
          console.error('Error updating separator:', error);
        });
    };


//Vocabulary
const [showVoc, setshowVoc] = useState(false);
const [leftValuesVoc, setleftValuesVoc] = useState([]);
const [rightValuesVoc, setrightValuesVoc] = useState([]);
const [selectedLeftVoc, setselectedLeftVoc] = useState('');
const [selectedRightVoc, setselectedRightVoc] = useState('');
const [newKeyVoc, setnewKeyVoc] = useState('');
const [newValueVoc, setnewValueVoc] = useState('');
const [showAddConfirmationVoc, setshowAddConfirmationVoc] = useState(false); 
const [showDeleteConfirmationVoc, setshowDeleteConfirmationVoc] = useState(false); 
const [showSaveConfirmationVoc, setshowSaveConfirmationVoc] = useState(false); 
//Handle sending key to server to delete 
const handleDeleteKeyValuePairVoc = (keyToDelete) => {
  axios
    .post('/api/delete-upload-voc', { key: selectedLeftVoc })
    .then(response => {
      console.log(response.data.message);
      const updatedLeftValues = leftValuesVoc.filter(key => key !== selectedLeftVoc);
      const updatedRightValues = rightValuesVoc.filter((_, index) => leftValuesVoc[index] !== selectedLeftVoc);
      setleftValuesVoc(updatedLeftValues);
      setrightValuesVoc(updatedRightValues);
      setshowDeleteConfirmationVoc(true);
      setselectedRightVoc('');
    })
    .catch(error => {
      console.error('Error deleting key-value pair:', error);
    });
};
//Setting value to edit depending on key selected 
const handleRightValueChangeVoc = (event) => {
  const newRightValue = event.target.value;
  setselectedRightVoc(newRightValue);
};
//Handle sending new value of key to server
const handleSaveRightValueVoc = () => {
  axios
    .post('/api/update-upload-voc', { key: selectedLeftVoc, value: selectedRightVoc })
    .then(response => {
      console.log(response.data.message);
      const updatedRightValues = [...rightValuesVoc];
      const selectedIndex = leftValuesVoc.indexOf(selectedLeftVoc);
      if (selectedIndex !== -1) {
        updatedRightValues[selectedIndex] = selectedRightVoc;
        setrightValuesVoc(updatedRightValues);
      }
      setshowSaveConfirmationVoc(true);
    })
    .catch(error => console.error('Error updating right value:', error));
};
const handleKeyChangeVoc = (event) => {
  setnewKeyVoc(event.target.value);
};
const handleValueChangeVoc = (event) => {
  setnewValueVoc(event.target.value);
};
//Handle sending new key and value to add
const handleAddKeyValuePairVoc = () => {
  if (!newKeyVoc.trim() || !newValueVoc.trim() ) {
    openModal('Please enter Term and replacement');
    return;
  } 
  // Make a POST request to the server to add the new key-value pair
  axios.post('/api/add-upload-voc', { key: newKeyVoc, value: newValueVoc })
    .then(response => {
      console.log(response.data.message);
        // Update the state after successfully adding the key-value pair
        setleftValuesVoc(prevLeftValues => [...prevLeftValues, newKeyVoc]);
        setrightValuesVoc(prevRightValues => [...prevRightValues, newValueVoc]);
        // Clear the input fields
        setnewKeyVoc('');
        setnewValueVoc('');
        setshowAddConfirmationVoc(true);
     
    })
    .catch(error => console.error('Error adding key-value pair:', error));
};
//Drop down
const handleLeftValueChangeVoc = (event) => {
  const selectedLeft = event.target.value;
  setselectedLeftVoc(selectedLeft);

  // Find the corresponding right value for the selected left value
  const selectedIndex = leftValuesVoc.indexOf(selectedLeft);
  if (selectedIndex !== -1) {
    setselectedRightVoc(rightValuesVoc[selectedIndex]);
  }
};
//Fetch data
useEffect(() => {
  fetch('/api/voc')
    .then(response => response.text())
    .then(data => {
      processUploadStructureVoc(data);
   
   
    })
    .catch(error => console.error('Error fetching layout info:', error));
}, []);
//split string into 2 arrays for key and values
const processUploadStructureVoc = (uploadStructureString) => {

  const leftA=[];
  const rightA=[];
    
  const trimmedString = uploadStructureString.replace(/^\s*\$vocab\s*=\s*{([\s\S]*?)};/, '$1');
  const tS = trimmedString.trim();


    const a = tS.split("\n");
    for (let i = 0; i < a.length; i++) {
      const s = a[i].toString();
    const b = s.split(' => ');
    if(b[0] != '# vocabulary iteration one end')
    {
      leftA.push(b[0]);
      rightA.push(b[1]);
    }
   
    
    }
   setleftValuesVoc(leftA);
   setrightValuesVoc(rightA);
  
  
    };

//Locations Of External Programs And Key Files
const [showLocEx, setshowLocEx] = useState(false);
const [tempLocEx, settempLocEx] = useState('');
const [leftValuesLE, setleftValuesLE] = useState([]);
const [rightValuesLE, setRightValuesLE] = useState([]);
const [selectedLeftLE, setselectedLeftLE] = useState('');
const [selectedRightLE, setselectedRightLE] = useState('');
const [newKeyLE, setNewKeyLE] = useState('');
const [newValueLE, setNewValueLE] = useState('');
const [showAddConfirmationLoc, setshowAddConfirmationLoc] = useState(false); 
const [showDeleteConfirmationLoc, setshowDeleteConfirmationLoc] = useState(false); 
const [showSaveConfirmationLoc, setshowSaveConfirmationLoc] = useState(false); 
//Send key to delete
const handleDeleteLocationFile = () => {
  axios
    .post('/api/deleteLocationFile', { key: selectedLeftLE })
    .then(response => {
      const updatedLeftValues = leftValuesLE.filter(value => value !== selectedLeftLE);
      console.log(response.data.message);
      setleftValuesLE(updatedLeftValues);
        setselectedLeftLE('');
        setselectedRightLE('');
        setshowDeleteConfirmationLoc(true);
      // Perform any necessary actions after successful deletion
      // For example, you can update your state or fetch updated data
    })
    .catch(error => {
      console.error('Error deleting key:', error);
    });
};
//Setting value
const handleRightValueChangeLE = (event) => {
  const newRightValue = event.target.value;
  setselectedRightLE(newRightValue);
};
//Send new value to server
const handleSaveRightValueLE = () => {
  // Make a POST request to update the right value
  axios.post('/api/update-upload-locations-files', { key: selectedLeftLE, value: selectedRightLE })
    .then(response => {
      console.log(response.data.message);
      // Update the state after successfully saving the right value
      const updatedRightValues = [...rightValuesLE];
      const selectedIndex = leftValuesLE.indexOf(selectedLeftLE);
      if (selectedIndex !== -1) {
        updatedRightValues[selectedIndex] = selectedRightLE;
        setRightValuesLE(updatedRightValues);
      }
      setshowSaveConfirmationLoc(true);
    })
    .catch(error => console.error('Error updating right value:', error));
};
const handleKeyChangeLE = (event) => {
  setNewKeyLE(event.target.value);
};
const handleValueChangeLE = (event) => {
  setNewValueLE(event.target.value);
};
//Send new key and value to server
const handleAddKeyValuePairLE = () => {
  if (!newKeyLE.trim() || !newValueLE.trim() ) {
    openModal('Please enter variable and path');
    return;
  } 
  // Make a POST request to the server to add the new key-value pair
  axios.post('/api/add-upload-locations-files', { key: newKeyLE, value: newValueLE })
    .then(response => {
      console.log(response.data.message);
         // Update the state after successfully adding the key-value pair
         setleftValuesLE(prevLeftValues => [...prevLeftValues, newKeyLE]);
         setRightValuesLE(prevRightValues => [...prevRightValues, newValueLE]);
         // Clear the input fields
         setNewKeyLE('');
         setNewValueLE('');
         setshowAddConfirmationLoc(true);

    })
    .catch(error => console.error('Error adding key-value pair:', error));
};
const handleLeftValueChangeLE = (event) => {
  const selectedLeft = event.target.value;
  setselectedLeftLE(selectedLeft);

  // Find the corresponding right value for the selected left value
  const selectedIndex = leftValuesLE.indexOf(selectedLeft);
  if (selectedIndex !== -1) {
    setselectedRightLE(rightValuesLE[selectedIndex]);
  }
};
//Process string to two arrays for key and values
const processUploadStructureTempLocEx = (uploadStructureString) => {

const leftA=[];
const rightA=[];
  

  const a = uploadStructureString.split("\n");
  for (let i = 0; i < a.length; i++) {
    const s = a[i].toString();
  const b = s.split(' = ');
  leftA.push(b[0]);
  rightA.push(b[1]);
  
  }
  setleftValuesLE(leftA);
  setRightValuesLE(rightA);


  };
useEffect(() => {
  fetch('/api/locations-files')
    .then(response => response.text())
    .then(data => {
      settempLocEx(data);
      processUploadStructureTempLocEx(data);
   
    
    })
    .catch(error => console.error('Error fetching layout info:', error));
}, []);

//Template locations
const [showTemLoc, setshowTemLoc] = useState(false);
const [tempString, settempString] = useState('');
const [leftValuesTL, setLeftValuesTL] = useState([]);
const [rightValuesTL, setRightValuesTL] = useState([]);
const [selectedLeftLN, setselectedLeftLN] = useState('');
const [selectedRightLN, setselectedRightLN] = useState('');
const [newKeyTL, setNewKeyTL] = useState('');
const [newValueTL, setNewValueTL] = useState('');
const [editingIndex, setEditingIndex] = useState(-1); // Index of the value being edited
const [showAddConfirmationTemp, setshowAddConfirmationTemp] = useState(false); 
const [showDeleteConfirmationTemp, setshowDeleteConfirmationTemp ] = useState(false); 
const [showSaveConfirmationDiTemp, setshowSaveConfirmationDiTemp] = useState(false); 
//Send key to delete 
const handleDeleteKeyValueTL = (key) => {
  // Make a POST request to delete the key-value pair
  axios.post('/api/deleteKeyValueTL', { key: selectedLeftLN })
    .then(response => {
      console.log(response.data.message);
      // Fetch updated template locations after deletion
      const updatedLeftValues = leftValuesTL.filter(value => value !== selectedLeftLN);
      const updatedRightValues = rightValuesTL.filter((value, index) => index !== leftValuesTL.indexOf(selectedLeftLN));
      setLeftValuesTL(updatedLeftValues);
      setRightValuesTL(updatedRightValues);
      setshowDeleteConfirmationTemp(true);
      setselectedRightLN('');
    })
    .catch(error => console.error('Error deleting key-value pair:', error));
};
//Setting value
  const handleRightValueEditT = (event) => {
    const newRightValue = event.target.value;
    setselectedRightLN(newRightValue);
  };
  const handleRightValueChangeT = (event) => {
    const updatedRightValues = [...rightValuesTL];
    updatedRightValues[editingIndex] = event.target.value;
    setRightValuesTL(updatedRightValues);
  };
//Send new value for key to server
  const handleSaveRightValueT = () => {
    // Make a POST request to update the right value
    axios.post('/api/updateRightValueTL', { key: selectedLeftLN, value: selectedRightLN })
      .then(response => {
        console.log(response.data.message);
        // Fetch updated template locations after saving
        fetchWebsiteTemplates();
        setshowSaveConfirmationDiTemp(true);
      })
      .catch(error => console.error('Error updating right value:', error));
  };
const handleKeyChangeTL = (event) => {
  setNewKeyTL(event.target.value);
};
const handleValueChangeTL = (event) => {
  setNewValueTL(event.target.value);
};
//Send new key and value to add to server
const handleAddKeyValuePairTL = () => {
  if (!newKeyTL.trim() || !newValueTL.trim() ) {
    openModal('Please enter directory and destination');
    return;
  } 
  
  // Make a POST request to the server to add the new key-value pair
  axios.post('/api/add-upload-website-templates', { key: newKeyTL, value: newValueTL })
    .then(response => {
      console.log(response.data.message);
    
      fetchWebsiteTemplates();
      setNewKeyTL('');
      setNewValueTL('');
      setshowAddConfirmationTemp(true);
    })
    .catch(error => console.error('Error adding key-value pair:', error));
};
//Fetch data
const fetchWebsiteTemplates = () => {
  fetch('/api/website-templates')
    .then(response => response.text())
    .then(data => {
      settempString(data);
      processUploadStructureTempLoc(data);
    })
    .catch(error => console.error('Error fetching website templates:', error));
};
useEffect(() => {
  fetch('/api/website-templates')
    .then(response => response.text())
    .then(data => {
      settempString(data);
      processUploadStructureTempLoc(data);
      
    
    })
    .catch(error => console.error('Error fetching layout info:', error));
}, []);
//Split string into two arrasy for key and value
const processUploadStructureTempLoc = (uploadStructureString) => {


// Define a regular expression to match arrays
const arrayPattern = /\[([^\]]+)\]\s*,?\s*/g;

// Array to store all extracted arrays
const extractedArrays = [];

let match;
while ((match = arrayPattern.exec(uploadStructureString)) !== null) {
    const arrayContent = match[1];
    const arrayElements = arrayContent.split(/\s*,\s*/);
    extractedArrays.push(arrayElements);
}

const leftA=[]
const rightA=[]
for (let i = 0; i < extractedArrays.length; i++) {
  const s = extractedArrays[i].toString();
const b = s.split(',');
leftA.push(b[0]);
rightA.push(b[1]);

 
}

setRightValuesTL(rightA);
setLeftValuesTL(leftA);
};
const handleLeftValueChangeLN = (event) => {
  const selectedLeft = event.target.value;
  setselectedLeftLN(selectedLeft);

  // Find the corresponding right value for the selected left value
  const selectedIndex = leftValuesTL.indexOf(selectedLeft);
  if (selectedIndex !== -1) {
    setselectedRightLN(rightValuesTL[selectedIndex]);
  }
};

  //Main Directory New
  const [showMainDNew, setshowMainDNew] = useState(false);
  const [layoutInfo, setLayoutInfo] = useState('');
  const [leftValuesMDN, setLeftValuesMDN] = useState([]);
  const [rightValuesMDN, setRightValuesMDN] = useState([]);
  const [selectedLeftMDN, setselectedLeftMDN] = useState('');
  const [selectedRightMDN, setselectedRightMDN] = useState('');
  const [newKeyMDN, setNewKeyMDN] = useState('');
  const [newValueMDN, setNewValueMDN] = useState('');
  const [showAddConfirmationMDN, setshowAddConfirmationMDN] = useState(false); 
  const [showDeleteConfirmationMDN, setshowDeleteConfirmationMDN ] = useState(false); 
  const [showSaveConfirmationDiMDN, setshowSaveConfirmationMDN] = useState(false); 

//Send key to delete
  const handleDeleteKeyMDN = () => {
    // Make a POST request to delete the key-value pair
    axios.post('/api/deleteKeyMDN', { key: selectedLeftMDN })
      .then(response => {
        console.log(response.data.message);
        // Fetch updated layout info after deleting
        fetchLayoutInfo();
          // Update state to remove the deleted key-value pair
          const updatedLeftValues = leftValuesMDN.filter(key => key !== selectedLeftMDN);
          const updatedRightValues = rightValuesMDN.filter((_, index) => index !== leftValuesMDN.indexOf(selectedLeftMDN));
          setLeftValuesMDN(updatedLeftValues);
          setRightValuesMDN(updatedRightValues);
  
          // Clear selection after deletion
          setselectedLeftMDN('');
          setselectedRightMDN('');

          setshowDeleteConfirmationMDN(true);
      })
      .catch(error => console.error('Error deleting key-value pair:', error));
  };
  const handleEditRightValueMDN = (event) => {
    const newRightValue = event.target.value;
    setselectedRightMDN(newRightValue);
  };
  
  const handleSaveRightValueMDN = () => {
    // Make a POST request to update the right value
    axios.post('/api/updateRightMDN', { key: selectedLeftMDN, value: selectedRightMDN })
      .then(response => {
        console.log(response.data.message);
        // Fetch updated layout info after saving
        fetchLayoutInfo();
        setshowSaveConfirmationMDN(true);
      })
      .catch(error => console.error('Error updating right value:', error));
  };
  const handleKeyChangeMDN = (event) => {
    setNewKeyMDN(event.target.value);
  };

  const handleValueChangeMDN = (event) => {
    setNewValueMDN(event.target.value);
  };
  //Fetch data
  const fetchLayoutInfo = () => {
    fetch('/api/layout-infoo')
      .then(response => response.text())
      .then(data => {
        setLayoutInfo(data);
        processUploadStructureMainDirectory(data);
      })
      .catch(error => console.error('Error fetching layout info:', error));
  };
  //Send new key and value
  const handleAddKeyValuePairMDN = () => {
    // Make a POST request to the server to add the new key-value pair
    if (!newKeyMDN.trim() || !newValueMDN.trim() ) {
      openModal('Please enter directory and subdirectorie');
      return;
    } 
    axios.post('/api/add-upload-ayout-infoo', { key: newKeyMDN, value: newValueMDN })
      .then(response => {
        console.log(response.data.message);
        fetchLayoutInfo();
        setshowAddConfirmationMDN(true);
      
      })
      .catch(error => console.error('Error adding key-value pair:', error));
  };
  useEffect(() => {
    fetch('/api/layout-infoo')
      .then(response => response.text())
      .then(data => {
        setLayoutInfo(data);
        processUploadStructureMainDirectory(data);
        
      
      })
      .catch(error => console.error('Error fetching layout info:', error));
  }, []);
  //Split string into arrays
  const processUploadStructureMainDirectory = (uploadStructureString) => {
    // Split the string by comma and newline to get individual lines
    const lines = uploadStructureString.split(/;\s*\n/);
    const leftValuesArr = [];
    const rightValuesArr = [];

    // Process each line to get the left and right values
    for (let i = 0; i < lines.length; i++) {
     const curr = lines[i];
     const sp = curr.split(' = ');
     leftValuesArr.push(sp[0]);
     rightValuesArr.push(sp[1]);
    }

    // Update the state with the left and right arrays
    setLeftValuesMDN(leftValuesArr);
    setRightValuesMDN(rightValuesArr);


  };
  const handleLeftValueChangeMDN = (event) => {
    const selectedLeft = event.target.value;
    setselectedLeftMDN(selectedLeft);

    // Find the corresponding right value for the selected left value
    const selectedIndex = leftValuesMDN.indexOf(selectedLeft);
    if (selectedIndex !== -1) {
      setselectedRightMDN(rightValuesMDN[selectedIndex]);
    }
  };

  //New Manageable directories
  const [showDirectoriesNew, setshowDirectoriesNew] = useState(false);
  const [uploadManageData, setUploadManageData] = useState(null);
  const [leftValuesMD, setLeftValuesMD] = useState([]);
  const [rightValuesMD, setRightValuesMD] = useState([]);
  const [selectedLeftValueMD, setSelectedLeftValueMD] = useState('');
  const [selectedRightValueMD, setSelectedRightValueMD] = useState('');
  const [newKeyManageD, setNewKeyManageD] = useState('');
  const [newValueManageD, setNewValueManageD] = useState('');
  const [showAddConfirmationDirec, setshowAddConfirmationDirec] = useState(false); 
  const [showDeleteConfirmationDirec, setshowDeleteConfirmationDirec ] = useState(false); 
  const [showSaveConfirmationDirec, setshowSaveConfirmationDirec] = useState(false); 
 //Send key
  const handleDeleteManagedDir = (key) => {
    axios.post('/api/deleteManagedDir', { key: selectedLeftValueMD })
      .then(response => {
        console.log(response.data.message);
        const updatedLeftValues = leftValuesMD.filter(value => value !== key);
        const updatedRightValues = rightValuesMD.filter(value => value !== selectedRightValueMD);
        setLeftValuesMD(updatedLeftValues);
        setRightValuesMD(updatedRightValues);
        setshowDeleteConfirmationDirec(true);
        setSelectedRightValueMD('');
      })
      .catch(error => console.error('Error deleting key-value pair:', error));
  };
  const handleRightValueChangeMD = (event) => {
    const newRightValue = event.target.value;
    setSelectedRightValueMD(newRightValue);
  };
//Send new value
  const handleSaveRightValuesMD = () => {
    // Make a POST request to update the right value
    axios.post('api/updateManagedDirs', { key: selectedLeftValueMD, value: selectedRightValueMD })
      .then(response => {
        console.log(response.data.message);
        const updatedRightValues = [...rightValuesMD];
      const selectedIndex = leftValuesMD.indexOf(selectedLeftValueMD);
      if (selectedIndex !== -1) {
        updatedRightValues[selectedIndex] = selectedRightValueMD;
        setRightValuesMD(updatedRightValues);
      }

        setshowSaveConfirmationDirec(true);
      })
      .catch(error => console.error('Error updating right value:', error));
  };
  useEffect(() => {
    fetchUploadManageData();
  }, []);
//Fetch data
  const fetchUploadManageData = () => {
    axios.get('/api/upload-manageableNew')
      .then(response => {
        setUploadManageData(response.data);
        processUploadStructureMD(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  const handleLeftValueChangeMD = (event) => {
    const selectedLeft = event.target.value;
    setSelectedLeftValueMD(selectedLeft);

    // Find the corresponding right value for the selected left value
    const selectedIndex = leftValuesMD.indexOf(selectedLeft);
    if (selectedIndex !== -1) {
      setSelectedRightValueMD(rightValuesMD[selectedIndex]);
    }
  };
  //Process string
  const processUploadStructureMD = (uploadStructureString) => {
    const withoutBrackets = uploadStructureString.replace(/\[|\]/g, '');
    const withoutTrailingComma = withoutBrackets.trim().replace(/,$/, '');
    const lines = withoutTrailingComma.split("\n");
    const leftValuesArr = [];
    const rightValuesArr = [];
    for (let i = 1; i < lines.length; i++) {

    const a = lines[i].split(', ');
    leftValuesArr.push(a[0]);
    const b = a[1].trim().replace(/,$/, '');
    rightValuesArr.push(b);
   
   }

    setLeftValuesMD(leftValuesArr);
    setRightValuesMD(rightValuesArr);

    


  };
//Send new key and value  
  const handleAddKeyValuePairManageD = () => {
    // Make a POST request to the server to add the new key-value pair
    if (!newKeyManageD.trim() || !newValueManageD.trim() ) {
      openModal('Please enter directory name and path');
      return;
    } 
    axios.post('/api/add-upload-manageableNew', { key: newKeyManageD, value: newValueManageD })
      .then(response => {
        console.log(response.data.message);
        fetchUploadManageData(); // Fetch updated data after adding key-value pair
        setNewKeyManageD('');
        setNewValueManageD('');
        setshowAddConfirmationDirec(true);
        //setUploadManageData(response.data);
      })
      .catch(error => console.error('Error adding key-value pair:', error));
  };
  const handleKeyChangeManageD = (event) => {
    setNewKeyManageD(event.target.value);
  };

  const handleValueChangeManageD = (event) => {
    setNewValueManageD(event.target.value);
  };
  useEffect(() => {
    // Make an HTTP request to the Node.js server's API endpoint
    axios.get('/api/upload-manageableNew')
      .then(response => {
        // Set the received data to the uploadManageData state
        setUploadManageData(response.data);
        processUploadStructureMD(response.data);
      
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

 
  //New To Structure Uploads Based On A Field
  const [showStructureNew, setshowStructureNew] = useState(false);
  const [leftValues, setLeftValues] = useState([]);
  const [rightValues, setRightValues] = useState([]);
  const [selectedLeftValue, setSelectedLeftValue] = useState('');
  const [selectedRightValue, setSelectedRightValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAddConfirmationStructure, setshowAddConfirmationStructure] = useState(false); 
  const [showDeleteConfirmationStructure, setshowDeleteConfirmationStructure] = useState(false); 
  const [showSaveConfirmationStructure, setshowSaveConfirmationStructure] = useState(false); 
  
  const handleRightValueChange = (event) => {
    const newRightValue = event.target.value;
    setSelectedRightValue(newRightValue);
  };
  //Send new value of key
  const handleSaveRightValue = () => {
    axios.post('/api/update-right-value', { key: selectedLeftValue, value: selectedRightValue })
      .then(response => {
        console.log(response.data.message);
        fetchUploadStructure(); // Update the upload structure after saving
        setshowSaveConfirmationStructure(true);
  
      })
      .catch(error => {
        console.error('Error updating right value:', error);
      });
  };
  //Send key
  const handleDeleteKeyValuePair = () => {
    axios.post('/api/delete-upload-structureNew', { key: selectedLeftValue })
      .then(response => {
        console.log(response.data.message);
        
        // Refresh the upload structure data after deletion
        fetchUploadStructure();
        setshowDeleteConfirmationStructure(true);
        setSelectedRightValue('');
        
      })
      .catch(error => {
        console.error('Error deleting key-value pair:', error);
      });
  };
  const handleKeyChange = (event) => {
    setNewKey(event.target.value);
  };

  const handleValueChange = (event) => {
    setNewValue(event.target.value);
  };
//Add new key and value
  const handleAddKeyValuePair = () => {
    if (!newKey.trim() || !newValue.trim() ) {
      openModal('Please enter category and file path');
      return;
    } 
    // Make a POST request to the server to add the new key-value pair
    axios.post('/api/add-upload-structureNew', { key: newKey, value: newValue })
      .then(response => {
        console.log(response.data.message);
        fetchUploadStructure();
        // Clear input fields
        setNewKey('');
        setNewValue('');
        setshowAddConfirmationStructure(true);
      
       
      })
      .catch(error => console.error('Error adding key-value pair:', error));
  };
  useEffect(() => {
    // Fetch the upload structure from the server when the component mounts
    fetchUploadStructure();
  }, []);
  //fetch data
  const fetchUploadStructure = () => {
    axios.get('/api/upload-structureNew')
      .then(response => {
        const { data } = response;
        processUploadStructure(data);
      })
      .catch(error => console.error('Error fetching upload structure:', error));
  };
//Process the string
  const processUploadStructure = (uploadStructureString) => {
    // Split the string by newline to get individual lines
    const lines = uploadStructureString.split('\n');
    const leftValuesArr = [];
    const rightValuesArr = [];
  
    let capturing = false; // Flag to indicate whether to capture key-value pairs
  
    // Process each line to get the left and right values
    lines.forEach(line => {
      if (line.includes('=> {')) {
        // Start capturing key-value pairs
        capturing = true;
      } else if (capturing) {
        // Check if the line contains a key-value pair
        const parts = line.trim().split(/\s*=>\s*/);
        if (parts.length === 2) {
          const left = parts[0].trim().replace(/['"]/g, ''); // Remove single quotes or double quotes
          const right = parts[1].trim().replace(/['"]/g, ''); // Remove single quotes or double quotes
          leftValuesArr.push(left);
          rightValuesArr.push(right.replace(/,$/, '')); // Remove comma at the end
        }
      }
  
      if (line.includes('}')) {
        // Stop capturing key-value pairs
        capturing = false;
      }
    });
  
    // Update the state with the left and right arrays
    setLeftValues(leftValuesArr);
    setRightValues(rightValuesArr);
  
    // Set the selected left value to the first value in the list
    if (leftValuesArr.length > 0) {
      setSelectedLeftValue(leftValuesArr[0]);
      setSelectedRightValue(rightValuesArr[0]);
    }
  };
  const handleLeftValueChange = (event) => {
    const selectedLeft = event.target.value;
    setSelectedLeftValue(selectedLeft);

    // Find the corresponding right value for the selected left value
    const selectedIndex = leftValues.indexOf(selectedLeft);
    if (selectedIndex !== -1) {
      setSelectedRightValue(rightValues[selectedIndex]);
    }
  };


//Drop down box handle change
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

//Input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

//Separator change for drop down
  const handleSep = (event) => {
    setinputSep(event.target.value);
  };

  //Following is for show states
  const handleButtonClick1 = () => {
    setShowInfo1(!showInfo1);
  };

  const handleButtonClick2 = () => {
    setShowInfo2(!showInfo2);
  };

 

  const handleButtonClick4 = () => {
    setShowInfoAF(!showInfoAF);
  };

  const handleButtonClick5 = () => {
    setshowAdmin(!showAdmin);
  };

  const handleButtonClick6 = () => {
    setshowSeparators(!showSeparators);
  };

  const handleButtonClick11 = () => {
    setshowStructureNew(!showStructureNew);
  };

  const handleButtonClick12 = () => {
    setshowDirectoriesNew(!showDirectoriesNew);
  };

  const handleButtonClick15 = () => {
    setshowMainDNew(!showMainDNew);
  };

  const handleButtonClick16 = () => {
    setshowTemLoc(!showTemLoc);
  };

  const handleButtonClick17 = () => {
    setshowLocEx(!showLocEx);
  };

  const handleButtonClick18 = () => {
    setshowVoc(!showVoc);
  };


  useEffect(() => {
    axios.get('/api/separators')
      .then(response => {
        const { separator, separator2, separatorClean, separator2Clean } = response.data;
        setSeparators({ separator, separator2, separatorClean, separator2Clean });
      })
      .catch(error => {
        console.error('Error fetching separators:', error);
      });
  }, []);
  
 

  return (
    <>

    <div>
    <h1 className="my-heading">Simple DL: Configurations</h1>
    <div className="black-line"></div>

    </div>



<div>
      
      <button className={`button-toggle ${showInfo1 ? 'active' : ''}`}onClick={handleButtonClick1}>
        {showInfo1 ? 'Hide System Configurations' : 'Show System Configurations'}
      </button>
      <button className={`button-toggleUI ${showInfo2 ? 'active' : ''}`}onClick={handleButtonClick2}>
        {showInfo2 ? 'Hide UI Configurations' : 'Show UI Configurations'}
      </button>

      {showInfo1 && (
        <div className="vocabulary-section">
          <h2 style={{ color: 'black', fontSize: '28px' }}>System Configurations</h2>
         

        
          <div>
      <button className={`button-toggle ${showInfoAF ? 'active' : ''}`} onClick={handleButtonClick4}>
        {showInfoAF ? '--Hide Acceptable File Formats For Upload' : '-->Show Acceptable File Formats For Upload'}
      </button>
      {showInfoAF && (
        <>
        <div className="vocabulary-section">
              <p>Please input a valid file format to allow for new digital artifacts to be uploaded</p>
          <h2 style={{ color: 'black', fontSize: '10px' }}>Acceptable File Formats For Upload:</h2>
          <div>
      
            </div>
          <div>
            {formats ? (
              formats.map((format, i) => (
                <p key={i} style={{ display: 'inline-block', marginRight: '5px', fontSize: '9.8px' }}>
                  {format}
                </p>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div>
            <form onSubmit={handleAdd}>
              <input type="text" value={inputValue} onChange={handleInputChange} />
              <button type="submit">Add</button>
              <button type="button" onClick={handleDelete}>Delete</button>
            </form>
          </div>
        </div>
        <Modal
  isOpen={showModal}
  onRequestClose={() => setShowModal(false)}
  contentLabel="Confirmation Modal"
  style={{
    content: {
      width: '300px', 
      margin: 'auto',
      height: '200px',
    },
  }}
>
  <div>
    <p>{modalMessage}</p>
    <button onClick={() => setShowModal(false)}>Close</button>
  </div>
</Modal>
<Modal
    isOpen={showDeleteConfirmationModal}
    onRequestClose={() => setShowDeleteConfirmationModal(false)}
    contentLabel="Delete Confirmation Modal"
    style={{
      content: {
        width: '300px',
        margin: 'auto',
        height: '200px',
      },
    }}
  >
    <div>
      <p>Are you sure you want to delete this format: {inputValue}?</p>
      <button onClick={() => {
        setShowDeleteConfirmationModal(false);
        handleDeleteConfirmed(); 
      }}>
        Yes
      </button>
      <button onClick={() => setShowDeleteConfirmationModal(false)}>No</button>
    </div>
  </Modal>
        </>
        
      )}
    </div>
       <div>
           <button className={`button-toggle ${showAdmin ? 'active' : ''}`}onClick={handleButtonClick5}>
        {showAdmin ? '--Hide Administrator Accounts' : '-->Show Administrator Accounts'}
      </button>
      {showAdmin && (
        <div className="vocabulary-section">
          <h2 style={{ color: 'black', fontSize: '10px' }}>Administrator Accounts:</h2>

          <div>
          <p>Add new administrator ID</p>
          <h2 style={{ color: 'black', fontSize: '10px' }}>Current administrator ids:</h2>
          <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
  {administrators.map((administrator, index) => (
    <li key={index} style={{ fontSize: '12px', marginRight: '10px' }}>
      {administrator}
      <button onClick={() => handleDeleteAdministrator(administrator)}>Delete</button>
    </li>
  ))}
  
</ul>
{showConfirmation && (
        <Modal
          isOpen={showConfirmation}
          onRequestClose={handleCancelDelete}
          contentLabel="Delete Confirmation"
          style={{
            content: {
              width: '300px',
              margin: 'auto', // Center the modal
              height: '200px',
            },
          }}
        >
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete user: {selectedAdministrator}?</p>
          <button onClick={handleConfirmDelete}>Yes</button>
          <button onClick={handleCancelDelete}>No</button>
        </Modal>
      )}
<div>
  <form onSubmit={handleAddAdministrator}>
    <input type="text" value={inputValueAdmin} onChange={handleInputChangeAdmin} />
    <button type="submit">Add Administrator</button>
  </form>
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
  {showAddConfirmation && (
  <Modal
    isOpen={showAddConfirmation}
    onRequestClose={() => setShowAddConfirmation(false)}
    contentLabel="Add Confirmation"
    style={{
      content: {
        width: '300px', 
        margin: 'auto', // Center the modal
        height: '200px',
      },
    }}
  >
    <h2>Added Administrator</h2>
    <p>
      {userExistsForAdd
        ? `Administrator already exists.`
        : `Administrator '${addedAdministrator}' added successfully.`}
    </p>
    <div className="confirmation-buttons">
      <button onClick={() => setShowAddConfirmation(false)}>OK</button>
    </div>
  </Modal>
)}
</div>
<p>Change salt input for hashing</p>
      <h2 style={{ color: 'black', fontSize: '10px' }}>Current salt:</h2>
      <p style={{ fontSize: '10px' }}>{verifySalt}</p>
    </div>
    <form onSubmit={handleUpdateSalt}>
      
          <input type="text" value={inputValueSalt} onChange={handleSalt} />

        <button type="submit">Update</button>
      </form>
      {showSaltUpdateConfirmation && (
    <Modal
      isOpen={showSaltUpdateConfirmation}
      onRequestClose={() => setShowSaltUpdateConfirmation(false)}
      contentLabel="Salt Update Confirmation"
      style={{
        content: {
          width: '300px',
          margin: 'auto',
          height: '200px',
        },
      }}
    >
      <h2>Salt Updated</h2>
      <p>The salt password has been updated successfully.</p>
      <button onClick={() => setShowSaltUpdateConfirmation(false)}>OK</button>
    </Modal>
  )}
        </div>
        
      )}

      </div>

      <div>
  <button className={`button-toggle ${showSeparators ? 'active' : ''}`} onClick={handleButtonClick6}>
    {showSeparators ? '--Hide Seperators' : '-->Show Seperators'}
  </button>
  {showSeparators && (
    <div className="vocabulary-section">
      <h2 style={{ color: 'black', fontSize: '10px' }}>Separators For Multiple Fields And Subfields:</h2>
      <div>
        <p style={{ color: 'black', fontSize: '10px' }}>Separator: {separators.separator}</p>
        <p style={{ color: 'black', fontSize: '10px' }}>Separator2: {separators.separator2}</p>
        <p style={{ color: 'black', fontSize: '10px' }}>SeparatorClean: {separators.separatorClean}</p>
        <p style={{ color: 'black', fontSize: '10px' }}>Separator2Clean: {separators.separator2Clean}</p>

        <div>
          <select value={selectedOption} onChange={handleSelectChange}>
            <option value="">-- Select --</option>
            <option value="separator">separator</option>
            <option value="separator2">separator2</option>
            <option value="separatorClean">separatorClean</option>
            <option value="separator2Clean">separator2Clean</option>
          </select>
          <p style={{ color: 'black', fontSize: '10px' }}>Change separator of: {selectedOption}</p>
        </div>

        <form onSubmit={handleSeparatorUpdate}>
          <input type="text" value={inputSep} onChange={handleSep} />
          <button type="submit">Update</button>
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
          {showSeparatorUpdateConfirmation && (
            <Modal
              isOpen={showSeparatorUpdateConfirmation}
              onRequestClose={() => setShowSeparatorUpdateConfirmation(false)}
              contentLabel="Separator Update Confirmation"
              style={{
                content: {
                  width: '300px',
                  margin: 'auto',
                  height: '200px',
                },
              }}
            >
              <h2>Separator Updated</h2>
              <p>The separator has been updated successfully.</p>
              <button onClick={() => setShowSeparatorUpdateConfirmation(false)}>OK</button>
            </Modal>
          )}
        </form>
      </div>
    </div>
  )}
</div>

       
    
       <button className={`button-toggle ${showFieldsNew ? 'active' : ''}`}onClick={handleButtonClick10}>
        {showFieldsNew ? '--Hide List Of Fields For Search And Browse And Sort' : '-->Show List Of Fields For Search And Browse And Sort'}
      </button>
      {showFieldsNew && (
        
        <main>
        <FieldsSort /> {/* Render the UI component */}
      </main>
        
      )}
   
      <div>
      <button className={`button-toggle ${showStructureNew ? 'active' : ''}`}onClick={handleButtonClick11}>
        {showStructureNew ? '--Hide How To Structure Uploads Based On A Field' : '-->Show How To Structure Uploads Based On A Field'}
      </button>
      {showStructureNew && (
        <div className="vocabulary-section">
          <h2 style={{ color: 'black', fontSize: '10px' }}>How To Structure Uploads Based On A Field:</h2>

        <p>Configuration showing a category and associated upload path indicates where files of that category should be stored or organized.</p>
    
          <div>
    
          <div>
        <select value={selectedLeftValue} onChange={handleLeftValueChange}>
          {leftValues.map((value, index) => (
            <option key={index} value={value}>{value}</option>
          ))}
        </select>
    <div>
        <input
  type="text"
  value={selectedRightValue}
  onChange={handleRightValueChange}
  style={{
    width: '300px',
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    padding: '5px',
    marginTop: '10px',   // Add margin to the top
    marginBottom: '10px' // Add margin to the bottom
  }}
/>
</div>
      <button onClick={handleSaveRightValue}>Save</button>
      {showSaveConfirmationStructure && (
      <Modal
        isOpen={showSaveConfirmationStructure}
        onRequestClose={() => setshowSaveConfirmationStructure(false)}
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
        <p>Category file path saved successfully.</p>
        <button onClick={() => setshowSaveConfirmationStructure(false)}>OK</button>
      </Modal>
    )}
        <button onClick={handleDeleteKeyValuePair}>Delete</button>
        {showDeleteConfirmationStructure && (
      <Modal
        isOpen={showDeleteConfirmationStructure}
        onRequestClose={() => setshowDeleteConfirmationStructure(false)}
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
        <p>Category deleted successfully.</p>
        <button onClick={() => setshowDeleteConfirmationStructure(false)}>OK</button>
      </Modal>
    )}
       
      </div>

      <div>
        
      </div>
      <div>
  
      <div>
        <label htmlFor="key">Category:</label>
        <input type="text" id="key" value={newKey} onChange={handleKeyChange} />
      </div>
      <div>
        <label htmlFor="value">File path:</label>
        <input type="text" id="value" value={newValue} onChange={handleValueChange} />
      </div>
      <button onClick={handleAddKeyValuePair}>Add category</button>
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
      {showAddConfirmationStructure && (
        <Modal
          isOpen={showAddConfirmationStructure}
          onRequestClose={() => setshowAddConfirmationStructure(false)}
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
          <p>New category-file path added successfully.</p>
          <button onClick={() => setshowAddConfirmationStructure(false)}>OK</button>
        </Modal>
      )}
    </div>
    
    </div>
        </div>
        
      )}

        </div>
        <div>
      <button className={`button-toggle ${showDirectoriesNew ? 'active' : ''}`} onClick={handleButtonClick12}>
        {showDirectoriesNew ? '--Hide Manageable Directories' : '-->Show Manageable Directories'}
      </button>
      {showDirectoriesNew && (
        <div className="vocabulary-section">
          <h2 style={{ color: 'black', fontSize: '10px' }}>Manageable Directories New:</h2>
          <p> Configuration representing a manageable directory along with its corresponding path.</p>
          <div>
       
       <select value={selectedLeftValueMD} onChange={handleLeftValueChangeMD}>
         {leftValuesMD.map((value, index) => (
           <option key={index} value={value}>{value}</option>
         ))}
       </select>
       <div>
       <input
  type="text"
  value={selectedRightValueMD}
  onChange={handleRightValueChangeMD}
  style={{
    width: '300px',
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    padding: '5px',
    marginTop: '10px',   // Add margin to the top
    marginBottom: '10px' // Add margin to the bottom
  }}
/>
</div>
<div>
      <button onClick={handleSaveRightValuesMD}>Save</button>
      {showSaveConfirmationDirec && (
      <Modal
        isOpen={showSaveConfirmationDirec}
        onRequestClose={() => setshowSaveConfirmationDirec(false)}
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
        <p>Directory path saved successfully.</p>
        <button onClick={() => setshowSaveConfirmationDirec(false)}>OK</button>
      </Modal>
    )}
      <button onClick={() => handleDeleteManagedDir(selectedLeftValueMD)}>
            Delete
          </button>
          {showDeleteConfirmationDirec && (
      <Modal
        isOpen={showDeleteConfirmationDirec}
        onRequestClose={() => setshowDeleteConfirmationDirec(false)}
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
        <p>Directory deleted successfully.</p>
        <button onClick={() => setshowDeleteConfirmationDirec(false)}>OK</button>
      </Modal>
    )}
          </div>
     </div>
     
     <div>
   

     </div>
          <div>
            <div>
              <label htmlFor="key">Directory Name:</label>
              <input type="text" id="key" value={newKeyManageD} onChange={handleKeyChangeManageD} />
            </div>
            <div>
              <label htmlFor="value">Corresponding Path:</label>
              <input type="text" id="value" value={newValueManageD} onChange={handleValueChangeManageD} />
            </div>
            <button onClick={handleAddKeyValuePairManageD}>Add directory</button>
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
            {showAddConfirmationDirec && (
      <Modal
        isOpen={showAddConfirmationDirec}
        onRequestClose={() => setshowAddConfirmationDirec(false)}
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
        <p>Directory added successfully.</p>
        <button onClick={() => setshowAddConfirmationDirec(false)}>OK</button>
      </Modal>
    )}
          </div>
        </div>
      )}
    </div>
          <button className={`button-toggle ${showMainDNew ? 'active' : ''}`}onClick={handleButtonClick15}>
        {showMainDNew ? '--Hide  Main Directory Layout New' : '-->Show Main Directory Layout New'}
      </button>
      {showMainDNew && (
         <div className="vocabulary-section">
         <h2 style={{ color: 'black', fontSize: '10px' }}>Main Directory Layout New:</h2>
         <p>Configuration defining a set of directory paths </p>
         <div>
       
       <select value={selectedLeftMDN} onChange={handleLeftValueChangeMDN}>
         {leftValuesMDN.map((value, index) => (
           <option key={index} value={value}>{value}</option>
         ))}
       </select>
       <div>
       <input
  type="text"
  value={selectedRightMDN}
  onChange={handleEditRightValueMDN}
  style={{
    width: '300px',
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    padding: '5px',
    marginTop: '10px',   // Add margin to the top
    marginBottom: '10px' // Add margin to the bottom
  }}
/>

</div>
<div>
<button onClick={handleSaveRightValueMDN}>Save</button>
{showSaveConfirmationDiMDN && (
      <Modal
        isOpen={showSaveConfirmationDiMDN}
        onRequestClose={() => setshowSaveConfirmationMDN(false)}
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
        <p>Directory path saved successfully.</p>
        <button onClick={() => setshowSaveConfirmationMDN(false)}>OK</button>
      </Modal>
    )}
   
      <button onClick={handleDeleteKeyMDN}>Delete</button>
      {showDeleteConfirmationMDN && (
      <Modal
        isOpen={showDeleteConfirmationMDN}
        onRequestClose={() => setshowDeleteConfirmationMDN(false)}
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
        <p>Directory path deleted successfully.</p>
        <button onClick={() => setshowDeleteConfirmationMDN(false)}>OK</button>
      </Modal>
    )}
    </div>
     </div>
     
     <div>
   
     
     </div>

     <div>
  
  <div>
    <label htmlFor="key">Directory:</label>
    <input type="text" id="key" value={newKeyMDN} onChange={handleKeyChangeMDN} />
  </div>
  <div>
    <label htmlFor="value">Subdirectorie:</label>
    <input type="text" id="value" value={newValueMDN} onChange={handleValueChangeMDN} />
  </div>
  <button onClick={handleAddKeyValuePairMDN}>Add directory</button>
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
  {showAddConfirmationMDN && (
      <Modal
        isOpen={showAddConfirmationMDN}
        onRequestClose={() => setshowAddConfirmationMDN(false)}
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
        <p>Directory path saved added successfully.</p>
        <button onClick={() => setshowAddConfirmationMDN(false)}>OK</button>
      </Modal>
    )}

</div>
         </div>

)}
<div>
   <button className={`button-toggle ${showTemLoc ? 'active' : ''}`}onClick={handleButtonClick16}>
        {showTemLoc ? '--Hide Website Templates Locations' : '-->Show Website Templates Locations'}
      </button>
      {showTemLoc && (
<div className="vocabulary-section">
<h2 style={{ color: 'black', fontSize: '10px' }}>Website Templates Locations:</h2>
<p>Configuration of source directory and a destination directory for copying templates.</p>
<div>
       
       <select value={selectedLeftLN} onChange={handleLeftValueChangeLN}>
         {leftValuesTL.map((value, index) => (
           <option key={index} value={value}>{value}</option>
         ))}
       </select>
       <div>
       <input
  type="text"
  value={selectedRightLN}
  onChange={handleRightValueEditT}
  style={{
    width: '300px',
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    padding: '5px',
    marginTop: '10px',   // Add margin to the top
    marginBottom: '10px' // Add margin to the bottom
  }}
/>
</div>
<button onClick={handleSaveRightValueT}>Save</button>
{showSaveConfirmationDiTemp && (
      <Modal
        isOpen={showSaveConfirmationDiTemp}
        onRequestClose={() => setshowSaveConfirmationDiTemp(false)}
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
        <p>Destination directory saved successfully.</p>
        <button onClick={() => setshowSaveConfirmationDiTemp(false)}>OK</button>
      </Modal>
    )}
<button onClick={() => handleDeleteKeyValueTL(selectedLeftLN)}>Delete</button>
{showDeleteConfirmationTemp && (
      <Modal
        isOpen={showDeleteConfirmationTemp}
        onRequestClose={() => setshowDeleteConfirmationTemp(false)}
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
        <p>Directory deleted successfully.</p>
        <button onClick={() => setshowDeleteConfirmationTemp(false)}>OK</button>
      </Modal>
    )}

     </div>
     
     <div>
   
      
     </div>

     <div>
  
  <div>
    <label htmlFor="key">Source directory:</label>
    <input type="text" id="key" value={newKeyTL} onChange={handleKeyChangeTL} />
  </div>
  <div>
    <label htmlFor="value">Destination directory:</label>
    <input type="text" id="value" value={newValueTL} onChange={handleValueChangeTL} />
  </div>
  <button onClick={handleAddKeyValuePairTL}>Add source directory</button>
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
  {showAddConfirmationTemp && (
      <Modal
        isOpen={showAddConfirmationTemp}
        onRequestClose={() => setshowAddConfirmationTemp(false)}
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
        <p>Directory added successfully.</p>
        <button onClick={() => setshowAddConfirmationTemp(false)}>OK</button>
      </Modal>
    )}
</div>
  </div>
  
)}
</div>
<div>
<button className={`button-toggle ${showLocEx ? 'active' : ''}`}onClick={handleButtonClick17}>
        {showLocEx ? '--Hide Locations Of External Programs And Key Files' : '-->Show Locations Of External Programs And Key Files'}
</button>
{showLocEx && (

<div className="vocabulary-section">
<h2 style={{ color: 'black', fontSize: '10px' }}>Locations Of External Programs And Key Files:</h2>
<p>Configuration showing variables that are used to store paths to different resources needed by SimpleDL.</p>
<div>
       
       <select value={selectedLeftLE} onChange={handleLeftValueChangeLE}>
         {leftValuesLE.map((value, index) => (
           <option key={index} value={value}>{value}</option>
         ))}
       </select>
     </div>
     <div>
    <input
      type="text"
      value={selectedRightLE}
      onChange={handleRightValueChangeLE}
      style={{
        width: '300px',
        backgroundColor: 'transparent',
        border: '1px solid #ccc',
        padding: '5px',
        marginTop: '10px',
        marginBottom: '10px'
      }}
    />
    <div>
    <button onClick={handleSaveRightValueLE}>Save</button>
    {showSaveConfirmationLoc && (
      <Modal
        isOpen={showSaveConfirmationLoc}
        onRequestClose={() => setshowSaveConfirmationLoc(false)}
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
        <p>Variable path saved successfully.</p>
        <button onClick={() => setshowSaveConfirmationLoc(false)}>OK</button>
      </Modal>
    )}
    <button onClick={handleDeleteLocationFile}>Delete</button>
    {showDeleteConfirmationLoc && (
      <Modal
        isOpen={showDeleteConfirmationLoc}
        onRequestClose={() => setshowDeleteConfirmationLoc(false)}
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
        <p>Variable deleted successfully.</p>
        <button onClick={() => setshowDeleteConfirmationLoc(false)}>OK</button>
      </Modal>
    )}
    </div>
  </div>
     <div>
   
      
     </div>

     <div>
  
  <div>
    <label htmlFor="key">Variable:</label>
    <input type="text" id="key" value={newKeyLE} onChange={handleKeyChangeLE} />
  </div>
  <div>
    <label htmlFor="value">Path:</label>
    <input type="text" id="value" value={newValueLE} onChange={handleValueChangeLE} />
  </div>
  <button onClick={handleAddKeyValuePairLE}>Add variable</button>
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
  {showAddConfirmationLoc && (
      <Modal
        isOpen={showAddConfirmationLoc}
        onRequestClose={() => setshowAddConfirmationLoc(false)}
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
        <p>Variable added successfully.</p>
        <button onClick={() => setshowAddConfirmationLoc(false)}>OK</button>
      </Modal>
    )}
</div>

</div>
)}
  </div>

  <div>
  <button className={`button-toggle ${showVoc ? 'active' : ''}`}onClick={handleButtonClick18}>
        {showVoc ? '--Hide Vocabulary' : '-->Show Vocabulary'}
</button>

{showVoc && (
  <div  className="vocabulary-section">
  <h2 style={{ color: 'black', fontSize: '10px' }}>Vocabulary:</h2>
  <p>Configuration showing terms with their corresponding replacements to standardize terminology</p>
  <div className="select-container">
       
       <select value={selectedLeftVoc} onChange={handleLeftValueChangeVoc}>
         {leftValuesVoc.map((value, index) => (
           <option key={index} value={value}>{value}</option>
         ))}
       </select>
     </div>
     <div>
    <input
      type="text"
      value={selectedRightVoc}
      onChange={handleRightValueChangeVoc}
      style={{
        width: '300px',
        backgroundColor: 'transparent',
        border: '1px solid #ccc',
        padding: '5px',
        marginTop: '10px',
        marginBottom: '10px'
      }}
    />
        <div>
        <button onClick={handleSaveRightValueVoc}>Save</button>
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
        <p>Term replacement saved successfully.</p>
        <button onClick={() => setshowSaveConfirmationVoc(false)}>OK</button>
      </Modal>
    )}
     <button onClick={handleDeleteKeyValuePairVoc}>Delete</button>
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
        <p>Term deleted successfully.</p>
        <button onClick={() => setshowDeleteConfirmationVoc(false)}>OK</button>
      </Modal>
    )}

  
    </div>
   
  </div>
     
     <div >
   
     
     </div>
     <div>
  
  <div>
    <label htmlFor="key">Term:</label>
    <input type="text" id="key" value={newKeyVoc} onChange={handleKeyChangeVoc} />
  </div>
  <div>
    <label htmlFor="value">Replacement:</label>
    <input type="text" id="value" value={newValueVoc} onChange={handleValueChangeVoc} />
  </div>
  <button onClick={handleAddKeyValuePairVoc}>Add term</button>
  <Modal
  isOpen={showModal}
  onRequestClose={() => setShowModal(false)}
  contentLabel="Confirmation Modal"
  style={{
    content: {
      width: '300px', 
      margin: 'auto', 
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
 
</div>
  </div>

)}
    </div>
          
        </div>
        
        
        
      )}

      {showInfo2 && (
      <main>
      <UI /> {/* Render the UI component */}
    </main>
      )}
    </div>


  </>
  )
}

export default App