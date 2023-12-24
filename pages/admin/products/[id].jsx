import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { ProductForm } from "pages-sections/admin";
import React, {useState} from "react";
import * as yup from "yup"; // form field validation schema
import api from "utils/api/dashboard";
import axiosInstance from "axios";
import {server_ip} from "utils/backend_server_ip.jsx"
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { getSession } from "next-auth/react"
import { useSession } from "next-auth/react";

const validationSchema = yup.object().shape({
  name: yup.string().required("required"),
  category: yup.string().required("required"),
  slug: yup.string().required("required"),
  description: yup.string().required("required"),
  stock: yup.number().required("required"),
  price: yup.number().required("required"),
  sale_price: yup.number().required("required"),
  tags: yup.object().required("required"),
}); // =============================================================================

EditProduct.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default function EditProduct(props) {
  const router = useRouter();
  const { data: session, status } = useSession()

  const callAPI = async () => {
    try {
        const res = await fetch(
            `/api/auth/session`,
            {
                method: 'GET',
            }
        );
        const data = await res.json();
        session = data;
    } catch (err) {
      toast.error('Session refresh failed!', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
      callAPI();
  };

  const itemCategoryList = []
  for(var iterator=0;iterator<props.itemCategory.length;iterator++){
    itemCategoryList.push(props.itemCategory[iterator]['categoryId']);
  }
  const allCategories = props.allCategories;
  const imgGallery = props.imgGallery;

  if(props.data[0]['newArrivalTill']){
  var fullDate = new Date(props.data[0]['newArrivalTill']);
  var twoDigitMonth = String(fullDate.getMonth() +1).padStart(2, '0');
  var twoDigitDate = String(fullDate.getDate()).padStart(2,'0');
  var arrivalTillDate = fullDate.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;
  }
  else{
    var arrivalTillDate = '';
  }

  const [disableButtonCheck,setdisableButtonCheck] = useState(false)
  const initialValues = {
    id:               props.data[0]['id'],
    extPosId:         props.data[0]['extPosId'],
    category:         "",
    name:             props.data[0]['name'],
    image:            props.data[0]['image'],
    slug:             props.data[0]['slug'],
    sku:              props.data[0]['sku'],
    description:      props.data[0]['description'],
    length:           props.data[0]['length'],
    height:           props.data[0]['height'],
    weight:           props.data[0]['weight'],
    width:            props.data[0]['width'],
    mrp:              props.data[0]['mrp'],
    salePrice:        props.data[0]['salePrice'],
    author:           props.data[0]['author'],
    manufacturer:     props.data[0]['manufacturer'],
    isbn:             props.data[0]['isbn'],
    isNewArrival:     props.data[0]['isNewArrival'],
    newArrivalTill:   arrivalTillDate,
    youtube_link:     props.data[0]['youtube_link'],
    facebook_link:    props.data[0]['facebook_link'],
    twitter_link:     props.data[0]['twitter_link'],
    instagram_link:   props.data[0]['instagram_link'],
    metaUrl:          props.data[0]['metaUrl'],
    metaTitle:        props.data[0]['metaTitle'],
    metaDescription:  props.data[0]['metaDescription'],
    stock:            props.data[0]['stock'],
    stockCheckQty:    props.data[0]['stockCheckQty'],
    isFeatured:       props.data[0]['isFeatured'],
  };
  async function updateItem(data,id,setdisableButtonCheck){

    const myNewModel = await axiosInstance
      .patch(server_ip+`updateItem/${id}`, data, {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization":'Bearer '+session.accessToken,
          },
      }).
      then((res) => {
        if(res.status == 200){
          setdisableButtonCheck(true);
          toast.success("Product Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
          }
          // window.location.href = '/admin/products';
          // router.back();
          router.push({
            pathname: `/admin/products`,
            query: { pageIndexRouter: router.query.pageIndexRouter, scrollPosition:router.query.scrollPosition, rowsPerPageRouter:router.query.rowsPerPageRouter },
          })
          return res;
      }).catch((error) => {
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error(error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
          }
          else{
            toast.error('Error Occured while Updating Product '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
          }
          return error.response
        } else if (error.request) {
          /// Network error api call not reached on server 
          toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
          return error.request
        } else {
          toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
          return error
        }
      });
  }
  async function updateItemCategory(data,id){
    const myNewModel = await axiosInstance
      .post(server_ip+`updateItemCategory/${id}`, data, {
          headers: {
              "Content-Type": "application/json",
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((response) => {
      if(response.data['ErrorCode']==1){
        toast.error(response.data['ErrorMsg'], {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      else{
        toast.success(response.data['ErrorMsg'], {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      return response.data
    }).catch((error) => {
      if (error.response) {
        //// if api not found or server responded with some error codes e.g. 404
        toast.error('Error Occured', {
          position: toast.POSITION.TOP_RIGHT
        });
        return error.response
      } else if (error.request) {
        /// Network error api call not reached on server
        toast.error('Network Error', {
          position: toast.POSITION.TOP_RIGHT
        });
        return error.request
      } else {
        toast.error('Error Occured', {
          position: toast.POSITION.TOP_RIGHT
        });
        return error
      }
    });
  }
  async function updateItemGallery(data,id){

    const myNewModel = await axiosInstance
      .post(server_ip+`updateItemGallery/${id}`, data, {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((res) => {
          return res;
      }).catch((error) => {
          return error.response;
      });
  }

  const handleFormSubmit = (values) => {
    // event.preventDefault();
    if(Math.floor(new Date(Date.now()))>Math.floor(new Date(session.expires))){
      reloadSession();
      toast.info('Session Expired! Refreshing Session....', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if(Math.floor(new Date(Date.now()))<Math.floor(new Date(session.expires))){

      const formData = new FormData();
      if (values.imageFile){
        formData.append("image", values['imageFile'], 
        initialValues['extPosId']+"."+values['imageFile'].name.split(".")[1]);
      }
      
      if(values.youtube_link!=initialValues['youtube_link']){formData.append("youtube_link", values['youtube_link'])}
      if(values.facebook_link!=initialValues['facebook_link']){formData.append("facebook_link", values['facebook_link'])}
      if(values.twitter_link!=initialValues['twitter_link']){formData.append("twitter_link", values['twitter_link'])}
      if(values.instagram_link!=initialValues['instagram_link']){formData.append("instagram_link", values['instagram_link'])}
      if(values.slug!=initialValues['slug']){formData.append("slug", values['slug'])}
      if(values.metaUrl!=initialValues['metaUrl']){formData.append("metaUrl", values['metaUrl'])}
      if(values.metaTitle!=initialValues['metaTitle']){formData.append("metaTitle", values['metaTitle'])}
      if(values.metaDescription!=initialValues['metaDescription']){formData.append("metaDescription", values['metaDescription'])}
      if(values.stockCheckQty!=initialValues['stockCheckQty']){formData.append("stockCheckQty", values['stockCheckQty'])}
      if(values.isNewArrival!=initialValues['isNewArrival']){formData.append("isNewArrival", values['isNewArrival'])}
      if(values.newArrivalTill!=initialValues['newArrivalTill']){formData.append("newArrivalTill", values['newArrivalTill'])}
      if(values.isFeatured!=initialValues['isFeatured']){formData.append("isFeatured", values['isFeatured'])}


      if(Array.isArray(values['category'])){updateItemCategory(values['category'],values.id);}

      const galleryData = new FormData();

      if(values.galleryFile){
        for(let i=0;i<values.galleryFile.length;i++){
          galleryData.append("image", values['galleryFile'][i], 
          // values['galleryFile'][i].name
          initialValues['extPosId']+"."+values['galleryFile'][i].name.split(".")[1]);
        }
      updateItemGallery(galleryData,values.id);
      }

      updateItem(formData,values.id,setdisableButtonCheck);
    }
    
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Edit Product</H3>

      <ProductForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        allCategories = {allCategories}
        imgGallery = {imgGallery}
        disableButtonCheck = {disableButtonCheck}
        itemCategoryList = {itemCategoryList}

      />
    </Box>
  );
}

export async function getServerSideProps(context) {
  var sessionValue = await getSession(context);
  if (!sessionValue) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const itemId = context.query['id'];
  const data = await api.getItem(itemId,sessionValue.accessToken);
  const itemCategory = await api.getItemCategory(itemId,sessionValue.accessToken);
  const imgGallery = await api.getItemGallery(itemId,sessionValue.accessToken);
  const allCategories = await api.getAllCategories();

  return { props: { data:data,allCategories:allCategories,imgGallery:imgGallery,itemCategory:itemCategory } }
}
