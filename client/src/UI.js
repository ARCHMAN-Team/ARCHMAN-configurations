import React,{useEffect,useState} from 'react'
import './App.css'; 
import { ChromePicker } from 'react-color'; 
import axios from 'axios';
import Modal from 'react-modal';


function UI() {


//Font family
const fontFamilies = [
  'Helvetica, Arial, sans-serif',
  'Georgia, serif',
  'Times New Roman, Times, serif',
  'Courier New, monospace',
  'Palatino, serif',
  'Verdana, Geneva, sans-serif',
  'Arial, Helvetica, sans-serif',
  'Lucida Sans, Lucida Sans Unicode, sans-serif',
  'Trebuchet MS, sans-serif',
  'Century Gothic, sans-serif',
  'Garamond, serif',
  'Bookman, serif',
  'Copperplate, Papyrus, fantasy',
  'Impact, Charcoal, sans-serif',
  'Franklin Gothic Medium, sans-serif',
  'Arial Black, Gadget, sans-serif',
  'Brush Script MT, cursive',
];
//CSS
const [showCSS, setshowCSS] = useState(false);
const [fontCss, setFontCss] = useState('');
const [fontSize, setFontSize] = useState('');
const [fontFamily, setFontFamily] = useState('');
const [bannerBorderColor, setBannerBorderColor] = useState('');
const [showColorPicker, setShowColorPicker] = useState(false);
const [collectionboxcolor, setcollectionboxcolor] = useState('');
const [showColorPickerCollectionBox, setshowColorPickerCollectionBox] = useState(false);
const [collectiontitle, setcollectiontitle] = useState('');
const [showColorPickercollectiontitle, setshowColorPickercollectiontitle] = useState(false);
const [linesection, setlinesection] = useState('');
const [showColorPickerlinesection, setshowColorPickerlinesection] = useState(false);
const [showSaveConfirmationDirec, setshowSaveConfirmationDirec] = useState(false); 
//Setting new colour
const handleColorChangelinesection = color => {
  setlinesection(color.hex);
};
//Sending new colour 
const handleColorSavelinesection = () => {
  axios.post('/api/linesection', { linesection })
    .then(() => {
      console.log('Collection box color updated successfully');
      setshowSaveConfirmationDirec(true);
    })
    .catch(error => {
      console.error('Error updating banner border color:', error);
    });
};
//Fetching current colour
useEffect(() => {
  axios.get('/api/linesection')
    .then(response => {
      setlinesection(response.data.bannerBorderColor);
    })
    .catch(error => {
      console.error('Error fetching banner border color:', error);
    });
}, []);
//Set new colour
const handleColorChangecollectiontitle = color => {
  setcollectiontitle(color.hex);
};
//send new colour
const handleColorSavecollectiontitle = () => {
  axios.post('/api/collectiontitle', { collectiontitle })
    .then(() => {
      console.log('Collection box color updated successfully');
      setshowSaveConfirmationDirec(true);
    })
    .catch(error => {
      console.error('Error updating banner border color:', error);
    });
};
//fetch colour
useEffect(() => {
  axios.get('/api/collectiontitle')
    .then(response => {
      setcollectiontitle(response.data.bannerBorderColor);
    })
    .catch(error => {
      console.error('Error fetching banner border color:', error);
    });
}, []);
//set new colour
const handleColorChangeCollectionBox = color => {
  setcollectionboxcolor(color.hex);
};
//send new colour
const handleColorSaveCollectionBox = () => {
  axios.post('/api/collectionboxcolor', { collectionboxcolor })
    .then(() => {
      console.log('Collection box color updated successfully');
      setshowSaveConfirmationDirec(true);
    })
    .catch(error => {
      console.error('Error updating banner border color:', error);
    });
};
//fetch colour
useEffect(() => {
  axios.get('/api/collectionboxcolor')
    .then(response => {
      setcollectionboxcolor(response.data.bannerBorderColor);
    })
    .catch(error => {
      console.error('Error fetching banner border color:', error);
    });
}, []);
//fetch colour
  useEffect(() => {
    axios.get('/api/bannerbordercolor')
      .then(response => {
        setBannerBorderColor(response.data.bannerBorderColor);
      })
      .catch(error => {
        console.error('Error fetching banner border color:', error);
      });
  }, []);
//set new colour
  const handleColorChange = color => {
    setBannerBorderColor(color.hex);
  };
//send new colour
  const handleColorSave = () => {
    axios.post('/api/bannerbordercolor', { bannerBorderColor })
      .then(() => {
        console.log('Banner border color updated successfully');
        setshowSaveConfirmationDirec(true);
      })
      .catch(error => {
        console.error('Error updating banner border color:', error);
      });
  };
//send font
const handleUpdateFont = () => {
  axios.post('/api/update-css', { fontSize: `${fontSize}pt`, fontFamily })
    .then(response => {
      console.log(response.data); 
      setshowSaveConfirmationDirec(true);
    })
    .catch(error => {
      console.error('Error updating font:', error);
    });
};
//fetch font
useEffect(() => {
  axios.get('/api/css')
    .then(response => {
      setFontCss(response.data.fontCss);

      const match = response.data.fontCss.match(/font:\s*(\d+pt)\s*([^;]+)/);
      if (match) {
        setFontSize(match[1]);
        setFontFamily(match[2]);
      }
    })
    .catch(error => {
      console.error('Error fetching font CSS:', error);
    });
}, []);
//fetch font
useEffect(() => {
  axios.get('/api/css')
    .then(response => {
      setFontCss(response.data.fontCss);

      const match = response.data.fontCss.match(/font:\s*(\d+pt)\s*([^;]+)/);
      if (match) {
        setFontSize(parseInt(match[1])); // Convert the font size to an integer
        setFontFamily(match[2]);
      }
    })
    .catch(error => {
      console.error('Error fetching font CSS:', error);
    });
}, []);

//Image
const [showImage, setshowImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageNames, setImageNames] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [currImage, setcurrImage] = useState('');
  const [newImage, setnewImage] = useState('');
  const [showSaveuplaod, setshowSaveuplaod] = useState(false); 
  const [showUpdateI, setshowUpdateI] = useState(false); 

  //fetch current image
  useEffect(() => {
    axios.get('/api/get-currImage') 
      .then(response => {
        setcurrImage(response.data.pageTitle);
      })
      .catch(error => {
        console.error('Error fetching pageTitleAdminHeader:', error);
      });
  }, []);
  //handle select
  const handleImageSelect = (event) => {
    setSelectedImage(event.target.value);
  };
  //fetch image names in folder
  const fetchImageNames = () => {
    axios.get('/api/getImageNames')
      .then(response => {
        setImageNames(response.data.imageNames);
      })
      .catch(error => {
        console.error('Error fetching image names:', error);
      });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
//upload new image
  const handleUpload = () => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    axios.post('/api/upload', formData)
      .then(response => {
        console.log('Image uploaded successfully');
        setshowSaveuplaod(true);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };
  // Fetch image names when the component mounts
  useEffect(() => {
    fetchImageNames();
  }, []);

  
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      fetchImageNames();
    }, 1000); 

    // Cleanup the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);
//set new image
  const handleNewImageUpload= () => {
    axios.post('/api/update-get-Image', { selectedImage }) 
      .then(response => {
        console.log('Title updated successfully');
        setnewImage('');
       setcurrImage(selectedImage);
       setshowUpdateI(true);
     
        
      })
      .catch(error => {
        console.error('Error updating title:', error);
      });
  };
//Titles
const [showTitles, setshowTitles] = useState(false);
const [pageTitle, setPageTitle] = useState('');
const [pageTitleAdminHeader, setPageTitleAdminHeader] = useState('');
const [newTitle, setNewTitle] = useState('');
const [bannerHome, setbannerHome] = useState('');
const [newbannerHome, setnewbannerHome] = useState('');
const [bannerAbout, setbannerAbout] = useState('');
const [newbannerAbout, setnewbannerAbout] = useState('');
const [bannerUsers, setbannerUsers] = useState('');
const [newbannerUsers, setnewbannerUsers] = useState('');
const [bannerSearch, setbannerSearch] = useState('');
const [newbannerSearch, setnewbannerSearch] = useState('');
const [bannerContact, setbannerContact] = useState('');
const [newbannerContact, setnewbannerContact] = useState('');
const [bannerLogIn, setbannerLogIn] = useState('');
const [newbannerLogIn, setnewbannerLogIn] = useState('');
const [indexAdminBanner, setindexAdminBanner] = useState('');
const [newindexAdminBanner, setnewindexAdminBanner] = useState('');
const [searchResultbanner, setsearchResultbanner] = useState('');
const [newSearchResults, setnewSearchResults] = useState('');
const [SearchTermsIn, setSearchTermsIn] = useState('');
const [newSearchTermsIn, setnewSearchTermsIn] = useState('');
const [SearchHeading, setSearchHeading] = useState('');
const [newSearchHeading, setnewSearchHeading] = useState('');
const [BrowseCollectionsHeading, setBrowseCollectionsHeading] = useState('');
const [newBrowseCollectionsHeading, setnewBrowseCollectionsHeading] = useState('');
const [AboutHeading, setAboutHeading] = useState('');
const [newAboutHeading, setnewAboutHeading] = useState('');

const [htmlheader, sethtmlheader] = useState('');
const [newHtml, setnewHtml] = useState('');

//Descriptions 
const [showDescriptions, setshowDescriptions] = useState(false);
const [AboutDesc, setAboutDesc] = useState('');
const [newAboutDesc, setnewAboutDesc] = useState('');
const [editModeAboutDesc, seteditModeAboutDesc] = useState(false);

const handleEditButtonClick = () => {
  seteditModeAboutDesc(true);
  setnewAboutDesc(AboutDesc); 
};

//Fetch description
useEffect(() => {
  axios.get('/api/get-AboutDesc') 
    .then(response => {
      setAboutDesc(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//Send new 
const handleNewAboutDesc= () => {
  axios.post('/api/update-get-AboutDesc', { newAboutDesc }) 
    .then(response => {
      console.log('Title updated successfully');
      setnewAboutDesc('');
      setAboutDesc(newAboutDesc);
      seteditModeAboutDesc(false);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//Allow text to be editable
const handleTextareaChange = event => {
  setnewAboutDesc(event.target.value);
};

//Fetch title
useEffect(() => {
  axios.get('/api/get-htmlHeadertitle') 
    .then(response => {
      sethtmlheader(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//Send new title
const handleNewHtmlHeader= () => {
  axios.post('/api/update-get-htmlHeadertitle', { newHtml }) 
    .then(response => {
      console.log('Title updated successfully');
      setnewHtml('');
      sethtmlheader(newHtml);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};




//Fetch title
useEffect(() => {
  axios.get('/api/get-AboutHeading') 
    .then(response => {
      setAboutHeading(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//Send new title
const handleNewAboutHeading= () => {
  axios.post('/api/update-get-AboutHeading', { newAboutHeading }) 
    .then(response => {
      console.log('Title updated successfully');
      setnewAboutHeading('');
      setAboutHeading(newAboutHeading);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//Fetch title
useEffect(() => {
  axios.get('/api/get-BrowseCollectionsHeading') 
    .then(response => {
      setBrowseCollectionsHeading(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//send title
const handleNewBrowseCollectionsHeading = () => {
  axios.post('/api/update-get-BrowseCollectionsHeading', { newBrowseCollectionsHeading }) 
    .then(response => {
      console.log('Title updated successfully');
      setnewBrowseCollectionsHeading('');
      setBrowseCollectionsHeading(newBrowseCollectionsHeading);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//fetch title
useEffect(() => {
  axios.get('/api/get-SearchHeading') 
    .then(response => {
      setSearchHeading(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//send title
const handleNewSearchHeading = () => {
  axios.post('/api/update-get-SearchHeading', { newSearchHeading }) 
    .then(response => {
      console.log('Title updated successfully');
      setnewSearchHeading('');
      setSearchHeading(newSearchHeading);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};

//fetch title
useEffect(() => {
  axios.get('/api/get-SearcTermsIn') 
    .then(response => {
      setSearchTermsIn(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//Send title
const handleSearchTermsInUpdate = () => {
  axios.post('/api/update-get-SearcTermsIn', { newSearchTermsIn })
    .then(response => {
      console.log('Title updated successfully');
      setnewSearchTermsIn('');
      setSearchTermsIn(newSearchTermsIn);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//Send title
const handleAdminSearchUpdate = () => {
  axios.post('/api/update-get-bannerSearch', { newbannerSearch }) 
    .then(response => {
      console.log('Title updated successfully');
      setnewbannerSearch('');
      setbannerSearch(newbannerSearch);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//Send title
const handleAdminLogInUpdate = () => {
  axios.post('/api/update-get-bannerLogIn', { newbannerLogIn }) 
    .then(response => {
      console.log('Title updated successfully');
      setnewbannerLogIn('');
      setbannerLogIn(newbannerLogIn);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//Send title
const handleAdminSearchContact = () => {
  axios.post('/api/update-get-bannerContact', { newbannerContact }) 
    .then(response => {
      console.log('Title updated successfully');
      setnewbannerContact('');
      setbannerContact(newbannerContact);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};

  //Send title
const handleAdminTitleUpdate = () => {
  axios.post('/api/update-pageTitleAdminHeader', { newTitle }) 
    .then(response => {
      console.log('Title updated successfully');
      setNewTitle('');
      setPageTitleAdminHeader(newTitle);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//Send title
const handleNewBannerHome = () => {
  axios.post('/api/update-get-bannerHome', { newbannerHome }) 
    .then(response => {
      console.log('Title updated successfully');
      setnewbannerHome('');
      setbannerHome(newbannerHome);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//Send title
const handleNewBannerAbout = () => {
  axios.post('/api/update-get-bannerAbout', { newbannerAbout })
    .then(response => {
      console.log('Title updated successfully');
      setnewbannerAbout('');
      setbannerAbout(newbannerAbout);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//Send title
const handleNewBannerIndexAdmin = () => {
  axios.post('/api/update-get-indexAdminBanner', { newindexAdminBanner })
    .then(response => {
      console.log('Title updated successfully');
      setnewindexAdminBanner('');
      setindexAdminBanner(newindexAdminBanner);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//Send title
const handleNewBannerSearchResult = () => {
  axios.post('/api/update-get-SearchResults', { newSearchResults })
    .then(response => {
      console.log('Title updated successfully');
      setnewSearchResults('');
      setsearchResultbanner(newSearchResults);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//fetch title
useEffect(() => {
  axios.get('/api/get-pageTitleAdminHeader') 
    .then(response => {
      setPageTitleAdminHeader(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//fetch title
useEffect(() => {
  axios.get('/api/get-bannerHome')
    .then(response => {
      setbannerHome(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//fetch title
useEffect(() => {
  axios.get('/api/get-indexAdminBanner')
    .then(response => {
      setindexAdminBanner(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//fetch title
useEffect(() => {
  axios.get('/api/get-bannerLogIn')
    .then(response => {
      setbannerLogIn(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//fetch title
useEffect(() => {
  axios.get('/api/get-bannerAbout')
    .then(response => {
      setbannerAbout(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//fetch title
useEffect(() => {
  axios.get('/api/get-bannerUsers')
    .then(response => {
      setbannerUsers(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//fetch title
useEffect(() => {
  axios.get('/api/get-SearchResults')
    .then(response => {
      setsearchResultbanner(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//fetch title
useEffect(() => {
  axios.get('/api/get-bannerContact')
    .then(response => {
      setbannerContact(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//fetch title
useEffect(() => {
  axios.get('/api/get-bannerSearch')
    .then(response => {
      setbannerSearch(response.data.pageTitle);
    })
    .catch(error => {
      console.error('Error fetching pageTitleAdminHeader:', error);
    });
}, []);
//send title
const handleNewBannerUsers = () => {
  axios.post('/api/update-get-bannerUsers', { newbannerUsers })
    .then(response => {
      console.log('Title updated successfully');
      setnewbannerUsers('');
      setbannerUsers(newbannerUsers);
      
    })
    .catch(error => {
      console.error('Error updating title:', error);
    });
};
//show states
const handleButtonClick20 = () => {
    setshowTitles(!showTitles);
  };


const handleButtonClick21 = () => {
  setshowDescriptions(!showDescriptions);
};

const handleButtonClick22 = () => {
  setshowImage(!showImage);
};

const handleButtonClick23 = () => {
  setshowCSS(!showCSS);
};

//fetch title
useEffect(() => {
  fetch('/api/get-title')
    .then((response) => response.json())
    .then((data) => setPageTitle(data.pageTitle))
    .catch((error) => console.error('Error fetching title:', error));
}, []);
//send title
const handleTitleUpdate = () => {
  const newTitle = prompt('Enter the new title:');
  if (newTitle) {
    fetch('/api/update-title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newTitle }),
    })
      .then((response) => response.json())
      .then(() => setPageTitle(newTitle))
      .catch((error) => console.error('Error updating title:', error));
  }
};

return (
<>
<h2 style={{ color: 'black', fontSize: '20px' }}>UI Configurations</h2>
<button className={`button-toggle ${showTitles ? 'active' : ''}`}onClick={handleButtonClick20}>
        {showTitles ? '--Hide Titles' : '-->Show Titles'}
</button>
{showTitles && (

        <div className="vocabulary-section">
          
          <p style={{ color: 'black', fontSize: '15px' }}>Current html header title:</p>
          <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{htmlheader}</h1>
    <div>
      <input
        type="text"
        value={newHtml}
        onChange={(e) => setnewHtml(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleNewHtmlHeader}>Update html header Title</button>
      </div>

    </div>

      
    <p style={{ color: 'black', fontSize: '15px' }}>Current admin header title:</p>
          <div>
      <h1 style={{ color: 'black', fontSize: '12px' }}>{pageTitleAdminHeader}</h1>
      <div>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleAdminTitleUpdate}>Update Admin Header Title</button>
      </div>
 
    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current index banner title:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{bannerHome}</h1>
    <div>
      <input
        type="text"
        value={newbannerHome}
        onChange={(e) => setnewbannerHome(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleNewBannerHome}>Update index banner Title</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current about banner title:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{bannerAbout}</h1>
    <div>
      <input
        type="text"
        value={newbannerAbout}
        onChange={(e) => setnewbannerAbout(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleNewBannerAbout}>Update index banner Title</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current users banner title:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{bannerUsers}</h1>
    <div>
      <input
        type="text"
        value={newbannerUsers}
        onChange={(e) => setnewbannerUsers(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleNewBannerUsers}>Update users banner Title</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current search banner title:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{bannerSearch}</h1>
    <div>
      <input
        type="text"
        value={newbannerSearch}
        onChange={(e) => setnewbannerSearch(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleAdminSearchUpdate}>Update search banner Title</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current contact banner title:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{bannerContact}</h1>
    <div>
      <input
        type="text"
        value={newbannerContact}
        onChange={(e) => setnewbannerContact(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleAdminSearchContact}>Update contact banner Title</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current LogIn banner title:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{bannerLogIn}</h1>
    <div>
      <input
        type="text"
        value={newbannerLogIn}
        onChange={(e) => setnewbannerLogIn(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleAdminLogInUpdate}>Update LogIn banner Title</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current index admin banner title:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{indexAdminBanner}</h1>
    <div>
      <input
        type="text"
        value={newindexAdminBanner}
        onChange={(e) => setnewindexAdminBanner(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleNewBannerIndexAdmin}>Update index admin banner Title</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current search result banner title:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{searchResultbanner}</h1>
    <div>
      <input
        type="text"
        value={newSearchResults}
        onChange={(e) => setnewSearchResults(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleNewBannerSearchResult}>Update search result banner Title</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current search terms banner title:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{SearchTermsIn}</h1>
    <div>
      <input
        type="text"
        value={newSearchTermsIn}
        onChange={(e) => setnewSearchTermsIn(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleSearchTermsInUpdate}>Update search terms banner Title</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current search heading title:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{SearchHeading}</h1>
    <div>
      <input
        type="text"
        value={newSearchHeading}
        onChange={(e) => setnewSearchHeading(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleNewSearchHeading}>Update search heading title</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current browse collection heading:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{BrowseCollectionsHeading}</h1>
    <div>
      <input
        type="text"
        value={newBrowseCollectionsHeading}
        onChange={(e) => setnewBrowseCollectionsHeading(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleNewBrowseCollectionsHeading}>Update browse collection heading</button>
      </div>

    </div>

    <p style={{ color: 'black', fontSize: '15px' }}>Current about heading:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{AboutHeading}</h1>
    <div>
      <input
        type="text"
        value={newAboutHeading}
        onChange={(e) => setnewAboutHeading(e.target.value)}
      />
        </div>
        <div>
      <button onClick={handleNewAboutHeading}>Update about heading</button>
      </div>

    </div>
        </div>

)}
<div>
<button className={`button-toggle ${showDescriptions ? 'active' : ''}`}onClick={handleButtonClick21}>
        {showDescriptions ? '--Hide Descriptions' : '-->Show Descriptions'}
</button>
{showDescriptions && (
<div>
<p style={{ color: 'black', fontSize: '15px' }}>Current about description:</p>
<div>
  {editModeAboutDesc ? (
    <div>
      <textarea
      rows={6}
      cols={35} 
        value={newAboutDesc}
        onChange={handleTextareaChange}
      />
      <button onClick={handleNewAboutDesc}>Save</button>
    </div>
  ) : (
    <div>
      <p>{AboutDesc}</p>
      <button onClick={handleEditButtonClick}>Edit</button>
    </div>
  )}


</div>

  </div>

)}
</div>

<div>
<button className={`button-toggle ${showImage ? 'active' : ''}`}onClick={handleButtonClick22}>
        {showImage ? '--Hide Images' : '-->Show Images'}
</button>
{showImage && (
  <div>
  <div>
      <h2>Image Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {showSaveuplaod && (
      <Modal
        isOpen={showSaveuplaod}
        onRequestClose={() => setshowSaveuplaod(false)}
        contentLabel="Add Confirmation"
        style={{
          content: {
            width: '300px',
            margin: 'auto',
            height: '200px',
          },
        }}
      >
        <h2>Upload Confirmation</h2>
        <p>Image uploaded successfully.</p>
        <button onClick={() => setshowSaveuplaod(false)}>OK</button>
      </Modal>
    )}
    </div>

    <div>
      <h1 style={{ color: 'black', fontSize: '10px' }}>Select an Image:</h1>
      <select value={selectedImage} onChange={handleImageSelect}>
        <option value="">Select an image</option>
        {imageNames.map((imageName, index) => (
          <option key={index} value={imageName}>{imageName}</option>
        ))}
      </select>

    </div>
    <p style={{ color: 'black', fontSize: '15px' }}>Current image:</p>
    <div>
    <h1 style={{ color: 'black', fontSize: '12px' }}>{currImage}</h1>
   
        <div>
      <button onClick={handleNewImageUpload}>Update image</button>
      {showUpdateI && (
      <Modal
        isOpen={showUpdateI}
        onRequestClose={() => setshowUpdateI(false)}
        contentLabel="Add Confirmation"
        style={{
          content: {
            width: '300px',
            margin: 'auto',
            height: '200px',
          },
        }}
      >
        <h2>Update Confirmation</h2>
        <p>Image updated successfully.</p>
        <button onClick={() => setshowUpdateI(false)}>OK</button>
      </Modal>
    )}
      </div>

    </div>
    </div>

)}
</div>

<div>
<button className={`button-toggle ${showCSS ? 'active' : ''}`}onClick={handleButtonClick23}>
        {showCSS ? '--Hide CSS Main' : '-->Show CSS Main'}
</button>
{showCSS && (
<div>
<div>
<p style={{ color: 'black', fontSize: '15px' }}>Body font:</p>
        <label>Font Size: </label>
        <input type="number" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} />
      </div>
      <div>
        <label>Font Family: </label>
        <select value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
          {fontFamilies.map((family, index) => (
            <option key={index} value={family}>
              {family}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleUpdateFont}>Update Font</button>
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
        <h2>Update Confirmation</h2>
        <p>CSS updated successfully.</p>
        <button onClick={() => setshowSaveConfirmationDirec(false)}>OK</button>
      </Modal>
    )}


      <div>
     
      <div>
      <p style={{ color: 'black', fontSize: '15px' }}>Banner color: {bannerBorderColor}</p>
        <button onClick={() => setShowColorPicker(!showColorPicker)}>
          Toggle Color Picker
        </button>
        {showColorPicker && (
          <ChromePicker color={bannerBorderColor} onChange={handleColorChange} />
        )}
        <button onClick={handleColorSave}>Save Color</button>
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
        <h2>Update Confirmation</h2>
        <p>CSS updated successfully.</p>
        <button onClick={() => setshowSaveConfirmationDirec(false)}>OK</button>
      </Modal>
    )}
      </div>

        </div>
        <div>
        <div>
      <p style={{ color: 'black', fontSize: '15px' }}>Collection box color: {collectionboxcolor}</p>
        <button onClick={() => setshowColorPickerCollectionBox(!showColorPickerCollectionBox)}>
          Toggle Color Picker
        </button>
        {showColorPickerCollectionBox && (
          <ChromePicker color={collectionboxcolor} onChange={handleColorChangeCollectionBox} />
        )}
        <button onClick={handleColorSaveCollectionBox}>Save Color</button>
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
        <h2>Update Confirmation</h2>
        <p>CSS updated successfully.</p>
        <button onClick={() => setshowSaveConfirmationDirec(false)}>OK</button>
      </Modal>
    )}
      </div>
          </div>

          <div>
        <div>
      <p style={{ color: 'black', fontSize: '15px' }}>Collection title color: {collectiontitle}</p>
        <button onClick={() => setshowColorPickercollectiontitle(!showColorPickercollectiontitle)}>
          Toggle Color Picker
        </button>
        {showColorPickercollectiontitle && (
          <ChromePicker color={collectiontitle} onChange={handleColorChangecollectiontitle} />
        )}
        <button onClick={handleColorSavecollectiontitle}>Save Color</button>
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
        <h2>Update Confirmation</h2>
        <p>CSS updated successfully.</p>
        <button onClick={() => setshowSaveConfirmationDirec(false)}>OK</button>
      </Modal>
    )}
      </div>
          </div>

          <div>
          <p style={{ color: 'black', fontSize: '15px' }}>line section color: {linesection}</p>
        <button onClick={() => setshowColorPickerlinesection(!showColorPickerlinesection)}>
          Toggle Color Picker
        </button>
        {showColorPickerlinesection && (
          <ChromePicker color={linesection} onChange={handleColorChangelinesection} />
        )}
        <button onClick={handleColorSavelinesection}>Save Color</button>
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
        <h2>Update Confirmation</h2>
        <p>CSS updated successfully.</p>
        <button onClick={() => setshowSaveConfirmationDirec(false)}>OK</button>
      </Modal>
    )}
            </div>
</div>

)}
</div>
</>


)
}
export default UI