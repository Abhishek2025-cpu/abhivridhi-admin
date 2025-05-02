import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

const EditFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = () => {
    axios
      .get('https://server1.pearl-developer.com/abhivriti/public/api/admin/faq')
      .then((response) => {
        setFaqs(
          response.data.data.map((faq) => ({
            ...faq,
            initialQuestion: faq.question,
            initialAnswer: faq.answer
          }))
        );
      })
      .catch((error) => {
        console.error('Error fetching FAQs:', error);
      });
  };

  const handleEditSubmit = (faq) => {
    if (
      faq.question === faq.initialQuestion &&
      faq.answer === faq.initialAnswer
    ) {
      setPopupMessage('Please update details first.');
      setPopupType('error');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    const apiUrl = `https://server1.pearl-developer.com/abhivriti/public/api/admin/edit-faqs/${faq.id}`;
    const form = new FormData();
    form.append('question', faq.question);
    form.append('answer', faq.answer);

    setLoading(true);

    axios
      .post(apiUrl, form)
      .then((response) => {
        setPopupMessage('FAQ updated successfully!');
        setPopupType('success');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/faqs');
        }, 3000);
      })
      .catch((error) => {
        console.error('Error updating FAQ:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    const apiUrl = `https://server1.pearl-developer.com/abhivriti/public/api/admin/delete-faqs/${faqToDelete}`;

    setLoading(true);

    axios
      .delete(apiUrl)
      .then((response) => {
        setPopupMessage('FAQ deleted successfully!');
        setPopupType('success');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/faqs');
        }, 3000);
      })
      .catch((error) => {
        console.error('Error deleting FAQ:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openConfirmPopup = (id) => {
    setFaqToDelete(id);
    setShowConfirmPopup(true);
  };

  const closeConfirmPopup = () => {
    setShowConfirmPopup(false);
    setFaqToDelete(null);
  };

  return (
    <div className="edit-faq-form container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit FAQs</h2>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <Oval color="#4A90E2" height={50} width={50} />
        </div>
      )}
      {!loading &&
        faqs.map((faq) => (
          <div key={faq.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit(faq);
              }}
              className="mb-4"
            >
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Question:
                <input
                  type="text"
                  name="question"
                  value={faq.question}
                  onChange={(e) =>
                    setFaqs(
                      faqs.map((item) =>
                        item.id === faq.id
                          ? { ...item, question: e.target.value }
                          : item
                      )
                    )
                  }
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Answer:
                <textarea
                  name="answer"
                  value={faq.answer}
                  onChange={(e) =>
                    setFaqs(
                      faqs.map((item) =>
                        item.id === faq.id
                          ? { ...item, answer: e.target.value }
                          : item
                      )
                    )
                  }
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
              </label>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => openConfirmPopup(faq.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        ))}
      {showPopup && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            popupType === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white px-4 py-2 rounded shadow-lg`}
        >
          {popupMessage}
        </div>
      )}
      {showConfirmPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg">
          <p className="mb-4">Are you sure you want to delete this FAQ?</p>
          <div className="flex justify-end">
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Yes
            </button>
            <button
              onClick={closeConfirmPopup}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFAQ;
