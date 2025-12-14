import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox
} from '@mui/material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    researchInterest: false
  });

  const [status, setStatus] = useState('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      researchInterest: e.target.checked
    }));
  };

  // AKNOTES: get these details
  // const AIRTABLE_BASE_ID = 'appyNdhZZn3gpovFh'; // Extracted from your URL

  const AIRTABLE_BASE_ID = 'app23q26k1uxn1fcx';
  const AIRTABLE_TABLE_NAME = 'ContactFormData'; // <--- VERIFY THIS NAME WITH DEVS
  const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_PAT; // Must be in .env file

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch(
        `/airtable-api/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              // These keys must match the Airtable COLUMN NAMES exactly.
              Name: formData.name,
              Email: formData.email,
              Feedback: formData.feedback,
              Interest: formData.researchInterest
            }
          })
        }
      );

      if (!response.ok) {
        console.error('Airtable Error:', await response.json());
        throw new Error('Failed to submit');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        feedback: '',
        researchInterest: false
      });
    } catch (error) {
      // AKDELETE
      console.log(error);
      setStatus('error');
    }
  };

  return (
    <Box sx={{ maxWidth: '600px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Contact
      </Typography>

      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Message sent! We'll get back to you soon.
        </Alert>
      )}

      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Something went wrong. Please try again later.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          disabled={status === 'submitting'}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          disabled={status === 'submitting'}
        />

        <TextField
          label="Feedback"
          name="feedback"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={formData.feedback}
          onChange={handleChange}
          disabled={status === 'submitting'}
          sx={{
            '& .MuiInputBase-inputMultiline': {
              resize: 'vertical'
            }
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.researchInterest}
              onChange={handleCheckboxChange}
              name="researchInterest"
              disabled={status === 'submitting'}
            />
          }
          label="I'm interested in helping PHLASK with future research"
          sx={{ mt: 2, mb: 2, display: 'block' }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            mt: 1,
            height: 50,
            bgcolor: '#1a1a1a',
            '&:hover': { bgcolor: '#333' }
          }}
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Submit'
          )}
        </Button>
      </form>

      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 2, color: 'text.secondary' }}
      >
        Do not submit passwords or sensitive personal information through this
        form.
      </Typography>
    </Box>
  );
};

export default Contact;

// import { useState } from 'react';
// import { Box, CircularProgress, Skeleton } from '@mui/material';

// const Contact = () => {

//   const [loading, setLoading] = useState(true);

//   const handleLoading = () => {
//     setLoading(false);
//   };

//   return (
//     <Box sx={{ height: '600px', width: '100%', position: 'relative' }}>
//       {loading && (
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             bgcolor: 'background.paper',
//             pt: 5,
//             paddingBlock: 2,
//             zIndex: 1
//           }}
//         >
//           {/* AKNOTES: Replace with Skeletons */}
//           {/* <CircularProgress /> */}
//           <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
//           <Skeleton
//             variant="rectangular"
//             height={50}
//             sx={{ mb: 3, borderRadius: 1 }}
//           />

//           <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
//           <Skeleton
//             variant="rectangular"
//             height={50}
//             sx={{ mb: 3, borderRadius: 1 }}
//           />

//           <Skeleton
//             variant="rectangular"
//             height={100}
//             sx={{ borderRadius: 1 }}
//           />
//         </Box>
//       )}

//       <iframe
//         title="Contact Us"
//         className="airtable-embed"
//         src="https://airtable.com/embed/appyNdhZZn3gpovFh/pagDtKnlb6n3mCpgd/form"
//         width="100%"
//         height="600px"
//         style={{ background: 'transparent', border: 'none' }}
//         onLoad={handleLoading}
//       />
//     </Box>
//   );
// };

// export default Contact;
